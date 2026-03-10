import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { getUserBiasHistory } from "../services/firestoreService";
import { downloadAnalyticsCSV } from "../utils/csvExport";
import BiasChart from "../components/BiasChart";
import HistoryChart from "../components/HistoryChart";

const toastStyle = {
    style: {
        background: "#0c1422",
        color: "#dce8f5",
        border: "1px solid rgba(255,255,255,0.1)",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12,
    },
};

const MI_COLOR = (mi) =>
    mi >= 75 ? "#ff3d3d" : mi >= 50 ? "#ff5a1f" : mi >= 25 ? "#ffc93c" : "#0aff9d";

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [biasHistory, setBiasHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUserBiasHistory(currentUser.uid)
            .then(setBiasHistory)
            .catch(() => setError("Failed to load analytics. Check your connection."))
            .finally(() => setLoading(false));
    }, [currentUser.uid]);

    const handleDownload = () => {
        try {
            downloadAnalyticsCSV(biasHistory, currentUser.uid);
            toast.success("Report downloaded.", toastStyle);
        } catch (err) {
            toast.error(err.message || "No data to export.", toastStyle);
        }
    };

    const latest = biasHistory[biasHistory.length - 1] ?? null;
    const total = biasHistory.length;

    // ─── Loading ───────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="loading-state">
                    <div className="loading-ring" />
                    <span>Loading neural analysis...</span>
                </div>
            </div>
        );
    }

    // ─── Error ─────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="dashboard-page">
                <div className="error-state">
                    <span className="error-icon">⚠</span>
                    <p>{error}</p>
                    <button className="btn-secondary" onClick={() => window.location.reload()}>
                        RETRY
                    </button>
                </div>
            </div>
        );
    }

    // ─── Empty ─────────────────────────────────────────────────────────
    if (total === 0) {
        return (
            <div className="dashboard-page">
                <Toaster position="top-right" toastOptions={toastStyle} />
                <div className="empty-state fade-in">
                    <div className="empty-icon">◎</div>
                    <h2 className="empty-title">No Data Yet</h2>
                    <p className="empty-sub">
                        Run your first behavioral experiment to generate your cognitive bias profile.
                    </p>
                    <button
                        className="btn-primary"
                        onClick={() => navigate("/experiment")}
                        id="start-first-experiment"
                        style={{ maxWidth: 280 }}
                    >
                        START EXPERIMENT →
                    </button>
                </div>
            </div>
        );
    }

    // ─── Dashboard ─────────────────────────────────────────────────────
    const latestMI = latest?.manipulation_index ?? 0;
    const miColor = MI_COLOR(latestMI);
    const latestScores = {
        framing_score: latest?.framing_score ?? 0,
        authority_score: latest?.authority_score ?? 0,
        emotional_score: latest?.emotional_score ?? 0,
        confirmation_score: latest?.confirmation_score ?? 0,
    };

    return (
        <div className="dashboard-page fade-in">
            <Toaster position="top-right" toastOptions={toastStyle} />

            {/* ── Header ── */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Analytics</h1>
                    <p className="dashboard-sub">
                        Cognitive bias profile ·{" "}
                        <span className="text-accent">{currentUser.email}</span>
                    </p>
                </div>
                <div className="dashboard-actions">
                    <button className="btn-secondary" onClick={() => navigate("/experiment")} id="new-experiment">
                        + New Experiment
                    </button>
                    <button className="btn-download" onClick={handleDownload} id="download-csv">
                        ↓ Download Report
                    </button>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="stats-grid">
                <div className="stat-card" style={{ "--stat-color": "#0aff9d" }}>
                    <span className="stat-lbl">Experiments</span>
                    <span className="stat-val">{total}</span>
                    <span className="stat-hint">Total sessions completed</span>
                </div>
                <div className="stat-card" style={{ "--stat-color": miColor }}>
                    <span className="stat-lbl">Manipulation Index</span>
                    <span className="stat-val" style={{ color: miColor }}>{latestMI}</span>
                    <span className="stat-hint">Latest session score / 100</span>
                </div>
                <div className="stat-card" style={{ "--stat-color": "#ff5a1f" }}>
                    <span className="stat-lbl">Framing Score</span>
                    <span className="stat-val" style={{ color: "#ff5a1f" }}>{latestScores.framing_score}</span>
                    <span className="stat-hint">Latest session</span>
                </div>
                <div className="stat-card" style={{ "--stat-color": "#10d0ff" }}>
                    <span className="stat-lbl">Confirmation Score</span>
                    <span className="stat-val" style={{ color: "#10d0ff" }}>{latestScores.confirmation_score}</span>
                    <span className="stat-hint">Latest session</span>
                </div>
            </div>

            {/* ── Charts ── */}
            <div className="charts-grid">
                <div className="chart-panel">
                    <div className="panel-head">
                        <h3 className="panel-title">Bias Score Breakdown</h3>
                        <span className="panel-sub">Latest experiment</span>
                    </div>
                    <BiasChart scores={latestScores} />
                </div>

                <div className="chart-panel">
                    <div className="panel-head">
                        <h3 className="panel-title">Manipulation Index History</h3>
                        <span className="panel-sub">{total} sessions</span>
                    </div>
                    <HistoryChart history={biasHistory} />
                </div>
            </div>

            {/* ── Experiment Log ── */}
            <div className="history-panel">
                <div className="history-head">
                    <h3 className="panel-title">Experiment Log</h3>
                    <span className="panel-sub">{total} sessions recorded</span>
                </div>
                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Framing</th>
                                <th>Authority</th>
                                <th>Emotional</th>
                                <th>Confirmation</th>
                                <th>MI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...biasHistory].reverse().map((entry, idx) => {
                                const date = entry.calculated_at?.toDate
                                    ? entry.calculated_at.toDate().toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })
                                    : "—";
                                const mi = entry.manipulation_index ?? 0;
                                const col = MI_COLOR(mi);
                                return (
                                    <tr key={entry.id || idx}>
                                        <td style={{ color: "#3a5070" }}>{total - idx}</td>
                                        <td>{date}</td>
                                        <td style={{ color: "#0aff9d" }}>{entry.framing_score ?? "—"}</td>
                                        <td style={{ color: "#ff5a1f" }}>{entry.authority_score ?? "—"}</td>
                                        <td style={{ color: "#c26bff" }}>{entry.emotional_score ?? "—"}</td>
                                        <td style={{ color: "#10d0ff" }}>{entry.confirmation_score ?? "—"}</td>
                                        <td>
                                            <span className="mi-pill" style={{ color: col, borderColor: col }}>
                                                {mi}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
