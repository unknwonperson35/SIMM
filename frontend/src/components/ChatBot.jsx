import { useState, useRef, useEffect, useCallback } from "react";
import { sendChatMessage } from "../services/chatService";
import { useAuth } from "../contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// ── Suggestion prompts shown before first message ──────────────────
const SUGGESTIONS = [
    "What is the Subconscious Influence Mapper?",
    "How are bias scores calculated?",
    "What is a Manipulation Vulnerability Index?",
    "How does framing bias work?",
    "What data is collected during experiments?",
    "Explain confirmation bias with an example.",
];

// ── Save a conversation turn to Firestore (logged-in only) ────────
const saveChatToFirestore = async (userId, userMsg, assistantMsg) => {
    try {
        await addDoc(collection(db, "chat_history"), {
            user_id: userId,
            user_msg: userMsg,
            bot_msg: assistantMsg,
            created_at: serverTimestamp(),
        });
    } catch {
        // Non-fatal — chat still works if save fails
    }
};

// ── Individual message bubble ──────────────────────────────────────
function MessageBubble({ msg }) {
    const isUser = msg.role === "user";
    const isError = msg.role === "error";

    return (
        <div className={`chat-msg chat-msg--${isUser ? "user" : isError ? "error" : "bot"}`}>
            {!isUser && (
                <div className="chat-avatar">
                    {isError ? "⚠" : "◈"}
                </div>
            )}
            <div className={`chat-bubble chat-bubble--${isUser ? "user" : isError ? "error" : "bot"}`}>
                {/* Simple markdown: bold (**text**), inline code (`text`), newlines */}
                {msg.content.split("\n").map((line, i) => {
                    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
                    return (
                        <p key={i} className={i > 0 ? "chat-p" : ""}>
                            {parts.map((part, j) => {
                                if (/^\*\*(.+)\*\*$/.test(part))
                                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                                if (/^`(.+)`$/.test(part))
                                    return <code key={j} className="chat-code">{part.slice(1, -1)}</code>;
                                return part;
                            })}
                        </p>
                    );
                })}
                <span className="chat-time">
                    {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>
            {isUser && <div className="chat-avatar chat-avatar--user">you</div>}
        </div>
    );
}

// ── Typing indicator ───────────────────────────────────────────────
function TypingIndicator() {
    return (
        <div className="chat-msg chat-msg--bot">
            <div className="chat-avatar">◈</div>
            <div className="chat-bubble chat-bubble--bot chat-bubble--typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
            </div>
        </div>
    );
}

// ── Main ChatBot Component ─────────────────────────────────────────
export default function ChatBot() {
    const { currentUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(0);
    const [hasOpened, setHasOpened] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const historyRef = useRef([]); // tracks {role, content} array for API

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Focus input when panel opens
    useEffect(() => {
        if (open) {
            setUnread(0);
            setHasOpened(true);
            setTimeout(() => inputRef.current?.focus(), 120);
        }
    }, [open]);

    // Welcome message on first open
    useEffect(() => {
        if (open && messages.length === 0) {
            const greeting = currentUser
                ? `Welcome back, **${currentUser.email.split("@")[0]}**. I'm ARIA, your SIM research assistant. Ask me anything about the platform, cognitive biases, or general knowledge.`
                : "Hi! I'm **ARIA** — the SIM AI assistant. I can answer questions about the Subconscious Influence Mapper, cognitive bias research, or anything else. *(No login required to chat!)*";

            const welcomeMsg = {
                role: "assistant",
                content: greeting,
                timestamp: new Date(),
            };
            setMessages([welcomeMsg]);
        }
    }, [open]);

    const sendMessage = useCallback(async (text) => {
        const userText = text.trim();
        if (!userText || loading) return;

        const userMsg = { role: "user", content: userText, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // Build history for API (last 10 turns to manage token cost)
        historyRef.current = [
            ...historyRef.current,
            { role: "user", content: userText },
        ].slice(-20);

        try {
            const reply = await sendChatMessage(historyRef.current);

            const botMsg = { role: "assistant", content: reply, timestamp: new Date() };
            setMessages(prev => [...prev, botMsg]);
            historyRef.current.push({ role: "assistant", content: reply });

            // Increment unread badge if panel is closed
            if (!open) setUnread(u => u + 1);

            // Optionally persist to Firestore for logged-in users
            if (currentUser) {
                saveChatToFirestore(currentUser.uid, userText, reply);
            }
        } catch (err) {
            const errMsg = err.message?.includes("OPENAI_API_KEY")
                ? "The AI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file."
                : err.message?.includes("429")
                    ? "Rate limit reached. Please wait a moment and try again."
                    : err.message?.includes("401")
                        ? "Invalid API key. Please check your VITE_OPENAI_API_KEY configuration."
                        : `Connection error: ${err.message}`;

            setMessages(prev => [...prev, {
                role: "error",
                content: errMsg,
                timestamp: new Date(),
            }]);
        } finally {
            setLoading(false);
        }
    }, [loading, open, currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleSuggestion = (text) => sendMessage(text);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const clearChat = () => {
        setMessages([]);
        historyRef.current = [];
        // Re-trigger welcome message
        setTimeout(() => {
            const greeting = currentUser
                ? `Session cleared. How can I help you, **${currentUser.email.split("@")[0]}**?`
                : "Session cleared. Ask me anything — no login required!";
            setMessages([{ role: "assistant", content: greeting, timestamp: new Date() }]);
        }, 50);
    };

    const showSuggestions = messages.length <= 1 && !loading;

    return (
        <>
            {/* ── Panel ── */}
            {open && (
                <div className="chat-panel slide-up" role="dialog" aria-label="ARIA AI Assistant">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <div className="chat-header-avatar">◈</div>
                            <div>
                                <p className="chat-header-name">ARIA</p>
                                <p className="chat-header-status">
                                    <span className="chat-status-dot" /> AI Research Assistant
                                    {!currentUser && (
                                        <span className="chat-guest-badge"> · Guest</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="chat-header-actions">
                            <button className="chat-icon-btn" onClick={clearChat} title="Clear chat" aria-label="Clear chat">
                                ↺
                            </button>
                            <button className="chat-icon-btn" onClick={() => setOpen(false)} title="Close" aria-label="Close chat">
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Context banner for guests */}
                    {!currentUser && (
                        <div className="chat-guest-banner">
                            <span>◎</span>
                            <span>
                                Chatting as <strong>Guest</strong> — conversations are not saved.{" "}
                                <a href="/signup" className="chat-banner-link" onClick={() => setOpen(false)}>
                                    Create account →
                                </a>
                            </span>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="chat-messages" id="chat-messages">
                        {messages.map((msg, i) => (
                            <MessageBubble key={i} msg={msg} />
                        ))}
                        {loading && <TypingIndicator />}
                        <div ref={messagesEndRef} />

                        {/* Suggestions */}
                        {showSuggestions && (
                            <div className="chat-suggestions fade-in">
                                <p className="chat-suggestions-label">Suggested questions</p>
                                <div className="chat-suggestion-list">
                                    {SUGGESTIONS.map((s, i) => (
                                        <button
                                            key={i}
                                            className="chat-suggestion-btn"
                                            onClick={() => handleSuggestion(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form className="chat-input-wrap" onSubmit={handleSubmit}>
                        <textarea
                            ref={inputRef}
                            className="chat-input"
                            placeholder="Ask ARIA anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            rows={1}
                            id="chat-input"
                        />
                        <button
                            type="submit"
                            className="chat-send-btn"
                            disabled={!input.trim() || loading}
                            aria-label="Send message"
                            id="chat-send"
                        >
                            {loading ? <span className="chat-spinner" /> : "↑"}
                        </button>
                    </form>

                    <div className="chat-footer">
                        Powered by <strong>GPT-4o</strong> · Press Enter to send
                    </div>
                </div>
            )}

            {/* ── Floating Button ── */}
            <button
                className={`chat-fab${open ? " chat-fab--open" : ""}`}
                onClick={() => setOpen(o => !o)}
                aria-label={open ? "Close AI assistant" : "Open AI assistant"}
                id="chat-fab"
            >
                {open ? (
                    <span className="chat-fab-icon">✕</span>
                ) : (
                    <>
                        <span className="chat-fab-icon">◈</span>
                        <span className="chat-fab-label">ARIA</span>
                        {unread > 0 && (
                            <span className="chat-fab-badge">{unread}</span>
                        )}
                        <span className="chat-fab-pulse" />
                    </>
                )}
            </button>
        </>
    );
}
