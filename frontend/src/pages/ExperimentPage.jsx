import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { QUESTIONS, TOTAL_QUESTIONS } from "../data/questions";
import {
    createSession,
    saveResponse,
    saveBiasScores,
    completeSession,
    updateUserStats,
} from "../services/firestoreService";
import { calculateBiasScores } from "../services/biasCalculator";
import QuestionCard from "../components/QuestionCard";
import ProgressBar from "../components/ProgressBar";

const PHASES = { INTRO: "intro", RUNNING: "running", DONE: "done" };

const BIAS_RESULT_COLORS = {
    framing_score: "#0aff9d",
    authority_score: "#ff5a1f",
    emotional_score: "#c26bff",
    confirmation_score: "#10d0ff",
};

export default function ExperimentPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [phase, setPhase] = useState(PHASES.INTRO);
    const [sessionId, setSessionId] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [responses, setResponses] = useState([]);
    const [finalScores, setFinalScores] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        try {
            const sid = await createSession(currentUser.uid, TOTAL_QUESTIONS);
            setSessionId(sid);
            setPhase(PHASES.RUNNING);
        } catch {
            toast.error("Failed to start session. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (responseData) => {
        const enriched = {
            ...responseData,
            session_id: sessionId,
            user_id: currentUser.uid,
        };
        const newResponses = [...responses, enriched];
        setResponses(newResponses);

        try {
            await saveResponse(enriched);
        } catch {
            toast.error("Response save failed. Continuing...");
        }

        if (currentIdx + 1 < TOTAL_QUESTIONS) {
            setCurrentIdx(i => i + 1);
        } else {
            await handleComplete(newResponses);
        }
    };

    const handleComplete = async (allResponses) => {
        setLoading(true);
        try {
            const scores = calculateBiasScores(allResponses);
            setFinalScores(scores);

            await saveBiasScores({
                user_id: currentUser.uid,
                session_id: sessionId,
                ...scores,
            });
            await completeSession(sessionId);
            await updateUserStats(currentUser.uid, scores.manipulation_index);

            setPhase(PHASES.DONE);
        } catch (err) {
            toast.error("Failed to save results. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = QUESTIONS[currentIdx];

    // ─── INTRO ────────────────────────────────────────────────────────
    if (phase === PHASES.INTRO) {
        return (
            <div className="experiment-page">
                <Toaster position="top-right" toastOptions={{
                    style: { background: "#0c1422", color: "#dce8f5", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "JetBrains Mono, monospace", fontSize: 12 }
                }} />
                <div className="experiment-intro slide-up">
                    <div className="intro-tag">◎ Behavioral Experiment Protocol</div>

                    <h1 className="intro-title">
                        Mapping Your<br />
                        <span className="text-accent">Subconscious</span>
                    </h1>

                    <p className="intro-desc">
                        You will answer <strong>{TOTAL_QUESTIONS} questions</strong> crafted by behavioral
                        psychologists to surface four hidden cognitive biases — framing, authority,
                        emotional, and confirmation bias.
                    </p>

                    <div className="intro-stats">
                        <div className="istat">
                            <span className="istat-num">{TOTAL_QUESTIONS}</span>
                            <span className="istat-txt">Questions</span>
                        </div>
                        <div className="istat">
                            <span className="istat-num">4</span>
                            <span className="istat-txt">Bias Types</span>
                        </div>
                        <div className="istat">
                            <span className="istat-num">~5</span>
                            <span className="istat-txt">Minutes</span>
                        </div>
                    </div>

                    <div className="intro-notice">
                        <span className="notice-dot" />
                        <span>
                            Your behavioral telemetry — response time, mouse distance, hover duration,
                            option switching, and scroll patterns — is recorded in real time to compute
                            precision bias scores.
                        </span>
                    </div>

                    <button
                        className="btn-primary btn-lg"
                        onClick={handleStart}
                        disabled={loading}
                        id="start-experiment"
                    >
                        {loading ? (
                            <span className="btn-loading">
                                <span className="spinner" /> INITIALIZING
                            </span>
                        ) : (
                            "BEGIN EXPERIMENT →"
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // ─── RUNNING ──────────────────────────────────────────────────────
    if (phase === PHASES.RUNNING) {
        return (
            <div className="experiment-page">
                <Toaster position="top-right" toastOptions={{
                    style: { background: "#0c1422", color: "#dce8f5", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "JetBrains Mono, monospace", fontSize: 12 }
                }} />
                <div className="experiment-running">
                    <ProgressBar current={currentIdx + 1} total={TOTAL_QUESTIONS} />
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-ring" />
                            <p>Processing responses...</p>
                        </div>
                    ) : (
                        <QuestionCard
                            key={currentQuestion.id}
                            question={currentQuestion}
                            questionNumber={currentIdx + 1}
                            totalQuestions={TOTAL_QUESTIONS}
                            onAnswer={handleAnswer}
                        />
                    )}
                </div>
            </div>
        );
    }

    // ─── DONE ─────────────────────────────────────────────────────────
    if (phase === PHASES.DONE && finalScores) {
        const MI = finalScores.manipulation_index;
        const riskLevel =
            MI >= 75 ? "HIGH" : MI >= 50 ? "MODERATE" : MI >= 25 ? "LOW" : "MINIMAL";
        const miColor =
            MI >= 75 ? "#ff3d3d" : MI >= 50 ? "#ff5a1f" : MI >= 25 ? "#ffc93c" : "#0aff9d";

        const biasItems = [
            { label: "Framing", key: "framing_score", color: BIAS_RESULT_COLORS.framing_score },
            { label: "Authority", key: "authority_score", color: BIAS_RESULT_COLORS.authority_score },
            { label: "Emotional", key: "emotional_score", color: BIAS_RESULT_COLORS.emotional_score },
            { label: "Confirmation", key: "confirmation_score", color: BIAS_RESULT_COLORS.confirmation_score },
        ];

        return (
            <div className="experiment-page">
                <div className="result-wrap">
                    <div className="result-tag">◎ Analysis Complete</div>
                    <h2 className="result-title">Experiment Results</h2>

                    <div
                        className="result-mi-ring"
                        style={{ "--mi-color": miColor }}
                    >
                        <span className="result-mi-val" style={{ color: miColor }}>{MI}</span>
                        <span className="result-mi-sub">/100</span>
                    </div>

                    <p className="result-mi-label">Manipulation Index</p>
                    <p className="result-risk" style={{ color: miColor }}>
                        {riskLevel} Susceptibility
                    </p>

                    <div className="result-bars">
                        {biasItems.map(({ label, key, color }) => (
                            <div className="result-row" key={key}>
                                <span className="result-row-lbl">{label}</span>
                                <div className="result-bar-track">
                                    <div
                                        className="result-bar-fill"
                                        style={{
                                            width: `${finalScores[key]}%`,
                                            background: color,
                                            animation: `barReveal 0.8s cubic-bezier(0.16,1,0.3,1) both`,
                                        }}
                                    />
                                </div>
                                <span className="result-row-val" style={{ color }}>
                                    {finalScores[key]}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="result-actions">
                        <button className="btn-primary" onClick={() => navigate("/")} style={{ maxWidth: 240 }}>
                            VIEW DASHBOARD →
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                setPhase(PHASES.INTRO);
                                setCurrentIdx(0);
                                setResponses([]);
                                setFinalScores(null);
                                setSessionId(null);
                            }}
                        >
                            RUN AGAIN
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
