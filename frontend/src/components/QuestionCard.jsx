import { useState, useRef, useEffect } from "react";

const BIAS_COLORS = {
    framing: { color: "#0aff9d", label: "FRAMING BIAS" },
    authority: { color: "#ff5a1f", label: "AUTHORITY BIAS" },
    emotional: { color: "#c26bff", label: "EMOTIONAL BIAS" },
    confirmation: { color: "#10d0ff", label: "CONFIRMATION BIAS" },
};

export default function QuestionCard({ question, questionNumber, totalQuestions, onAnswer }) {
    const [selected, setSelected] = useState(null);
    const [confidence, setConfidence] = useState(5);
    const [optionSwitches, setOptionSwitches] = useState(0);
    const [hoverStart, setHoverStart] = useState(null);
    const [totalHover, setTotalHover] = useState(0);
    const [mouseDistance, setMouseDistance] = useState(0);
    const [lastMouse, setLastMouse] = useState(null);
    const [scrollPause, setScrollPause] = useState(0);

    const startTimeRef = useRef(Date.now());
    const scrollTimerRef = useRef(null);
    const lastScrollRef = useRef(Date.now());
    const cardRef = useRef(null);

    // Track mouse movement distance
    useEffect(() => {
        const handleMouseMove = (e) => {
            setLastMouse(prev => {
                if (!prev) return { x: e.clientX, y: e.clientY };
                const dx = e.clientX - prev.x;
                const dy = e.clientY - prev.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                setMouseDistance(d => d + dist);
                return { x: e.clientX, y: e.clientY };
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Track scroll pauses
    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            const gap = now - lastScrollRef.current;
            if (gap > 500) setScrollPause(p => p + gap);
            lastScrollRef.current = now;

            clearTimeout(scrollTimerRef.current);
            scrollTimerRef.current = setTimeout(() => {
                lastScrollRef.current = Date.now();
            }, 600);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSelect = (opt) => {
        if (selected !== null && selected !== opt) {
            setOptionSwitches(s => s + 1);
        }
        setSelected(opt);
    };

    const handleOptionHoverStart = () => setHoverStart(Date.now());
    const handleOptionHoverEnd = () => {
        if (hoverStart) {
            setTotalHover(h => h + (Date.now() - hoverStart));
            setHoverStart(null);
        }
    };

    const handleSubmit = () => {
        if (!selected) return;
        const responseTime = Date.now() - startTimeRef.current;

        onAnswer({
            question_id: question.id,
            bias_category: question.bias_category,
            selected_option: selected,
            response_time: responseTime,
            mouse_distance: Math.round(mouseDistance),
            hover_time: totalHover,
            scroll_pause: scrollPause,
            option_switches: optionSwitches,
            confidence_rating: confidence,
        });
    };

    const { color, label } = BIAS_COLORS[question.bias_category] || { color: "#0aff9d", label: "UNKNOWN" };

    return (
        <div className="q-card" ref={cardRef}>
            <div className="q-head">
                <span
                    className="q-bias-badge"
                    style={{ color, borderColor: `${color}55` }}
                >
                    {label}
                </span>
                <span className="q-num">
                    #{String(questionNumber).padStart(2, "0")} / {String(totalQuestions).padStart(2, "0")}
                </span>
            </div>

            <p className="q-text">{question.text}</p>

            <div className="q-options">
                {[
                    { key: "A", text: question.option_a },
                    { key: "B", text: question.option_b },
                ].map(({ key, text }) => (
                    <button
                        key={key}
                        className={`q-opt${selected === key ? " q-opt--selected" : ""}`}
                        style={
                            selected === key
                                ? { borderColor: color, color }
                                : {}
                        }
                        onClick={() => handleSelect(key)}
                        onMouseEnter={handleOptionHoverStart}
                        onMouseLeave={handleOptionHoverEnd}
                        id={`option-${key.toLowerCase()}`}
                    >
                        <span className="q-opt-label">OPTION {key}</span>
                        <span className="q-opt-text">{text}</span>
                    </button>
                ))}
            </div>

            {question.tip && (
                <div className="q-tip">◎ {question.tip}</div>
            )}

            <div className="q-confidence">
                <div className="q-confidence-head">
                    <span className="q-confidence-lbl">Confidence Level</span>
                    <span className="q-confidence-val">{confidence} / 10</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={confidence}
                    onChange={e => setConfidence(Number(e.target.value))}
                    className="q-slider"
                    id="confidence-slider"
                />
            </div>

            <button
                className="q-submit"
                onClick={handleSubmit}
                disabled={!selected}
                id="submit-answer"
            >
                {selected ? "CONFIRM ANSWER →" : "SELECT AN OPTION FIRST"}
            </button>
        </div>
    );
}
