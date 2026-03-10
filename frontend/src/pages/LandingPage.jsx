import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const BIASES = [
    {
        icon: "◧",
        title: "Framing Bias",
        color: "var(--green)",
        desc: "How information is presented — gain vs. loss framing — shapes decisions more than the underlying facts.",
    },
    {
        icon: "◨",
        title: "Authority Bias",
        color: "var(--orange)",
        desc: "Perceived expertise and credentials cause us to overweight opinions regardless of evidence quality.",
    },
    {
        icon: "◫",
        title: "Emotional Bias",
        color: "var(--purple)",
        desc: "Emotionally charged language and vivid narratives override statistical reasoning and objective data.",
    },
    {
        icon: "◪",
        title: "Confirmation Bias",
        color: "var(--cyan)",
        desc: "We seek and remember information that confirms existing beliefs while discounting contradictory evidence.",
    },
];

const STEPS = [
    {
        n: "01",
        title: "Run an Experiment",
        desc: "Answer 12 psychologically designed questions while the platform silently records your behavioral telemetry — response time, hover patterns, and option-switching frequency.",
    },
    {
        n: "02",
        title: "Telemetry Analysis",
        desc: "A multi-signal algorithm processes your behavioral data across four cognitive bias dimensions and computes precise susceptibility scores.",
    },
    {
        n: "03",
        title: "Your Bias Profile",
        desc: "View your Manipulation Vulnerability Index and detailed bias breakdown on your personal analytics dashboard. Compare across sessions over time.",
    },
];

export default function LandingPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleCTA = () => {
        navigate(currentUser ? "/dashboard" : "/signup");
    };

    return (
        <div className="landing-page">
            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="landing-hero">
                <div className="landing-hero-inner">
                    <div className="landing-hero-badge">
                        <span className="landing-badge-dot" />
                        Behavioral Psychology Research Platform
                    </div>

                    <h1 className="landing-hero-title">
                        Map Your
                        <br />
                        <span className="text-accent">Subconscious</span>
                        <br />
                        Influences
                    </h1>

                    <p className="landing-hero-sub">
                        SIM runs structured cognitive experiments that detect, quantify, and
                        visualize the unconscious biases shaping your everyday decisions.
                    </p>

                    <div className="landing-hero-actions">
                        <button
                            className="landing-btn-primary"
                            onClick={handleCTA}
                            id="landing-get-started"
                        >
                            {currentUser ? "Go to Dashboard →" : "Start Free Analysis →"}
                        </button>
                        <Link to="/about" className="landing-btn-ghost" id="landing-learn-more">
                            Learn How It Works
                        </Link>
                    </div>

                    <div className="landing-hero-stats">
                        {[
                            { val: "4", label: "Bias Dimensions" },
                            { val: "12", label: "Questions per Session" },
                            { val: "6", label: "Behavioral Signals" },
                        ].map(({ val, label }) => (
                            <div className="landing-stat" key={label}>
                                <span className="landing-stat-val">{val}</span>
                                <span className="landing-stat-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative glyph grid */}
                <div className="landing-hero-glyph" aria-hidden="true">
                    <div className="hero-glyph-ring hero-glyph-ring--1" />
                    <div className="hero-glyph-ring hero-glyph-ring--2" />
                    <div className="hero-glyph-core">◈</div>
                </div>
            </section>

            {/* ── How It Works ───────────────────────────────────────── */}
            <section className="landing-section">
                <div className="landing-section-inner">
                    <div className="landing-section-head">
                        <span className="landing-eyebrow">◎ How It Works</span>
                        <h2 className="landing-section-title">
                            Three Steps to Your{" "}
                            <span className="text-accent">Bias Profile</span>
                        </h2>
                        <p className="landing-section-sub">
                            A fully automated pipeline from behavioral signal capture to cognitive
                            bias quantification.
                        </p>
                    </div>

                    <div className="landing-steps">
                        {STEPS.map(({ n, title, desc }) => (
                            <div className="landing-step-card" key={n}>
                                <div className="landing-step-num">{n}</div>
                                <h3 className="landing-step-title">{title}</h3>
                                <p className="landing-step-desc">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Cognitive Biases ───────────────────────────────────── */}
            <section className="landing-section landing-section--alt">
                <div className="landing-section-inner">
                    <div className="landing-section-head">
                        <span className="landing-eyebrow">⬡ What We Measure</span>
                        <h2 className="landing-section-title">
                            Four Dimensions of{" "}
                            <span className="text-accent">Cognitive Bias</span>
                        </h2>
                        <p className="landing-section-sub">
                            SIM detects and scores the four primary bias categories that leave
                            people most susceptible to subconscious influence.
                        </p>
                    </div>

                    <div className="landing-bias-grid">
                        {BIASES.map(({ icon, title, color, desc }) => (
                            <div className="landing-bias-card" key={title}>
                                <div
                                    className="landing-bias-icon"
                                    style={{ color, borderColor: color + "44", background: color + "11" }}
                                >
                                    {icon}
                                </div>
                                <h3 className="landing-bias-title" style={{ color }}>
                                    {title}
                                </h3>
                                <p className="landing-bias-desc">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MVI Banner ─────────────────────────────────────────── */}
            <section className="landing-section">
                <div className="landing-section-inner">
                    <div className="landing-mvi-card">
                        <div className="landing-mvi-left">
                            <span className="landing-eyebrow" style={{ textAlign: "left", display: "block" }}>
                                ◈ Your Score
                            </span>
                            <h2 className="landing-mvi-title">
                                The Manipulation
                                <br />
                                <span className="text-accent">Vulnerability Index</span>
                            </h2>
                            <p className="landing-mvi-sub">
                                Your four bias scores are averaged into a single composite MVI (0–100)
                                — your overall susceptibility to subconscious influence.
                            </p>
                        </div>
                        <div className="landing-mvi-scale">
                            {[
                                { range: "0–24", label: "MINIMAL", color: "var(--green)" },
                                { range: "25–49", label: "LOW", color: "var(--yellow)" },
                                { range: "50–74", label: "MODERATE", color: "var(--orange)" },
                                { range: "75–100", label: "HIGH", color: "var(--red)" },
                            ].map(({ range, label, color }) => (
                                <div
                                    className="landing-mvi-band"
                                    key={label}
                                    style={{ borderColor: color + "88" }}
                                >
                                    <span className="landing-mvi-range" style={{ color }}>
                                        {range}
                                    </span>
                                    <span className="landing-mvi-label" style={{ color }}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────────── */}
            <section className="landing-cta-section">
                <div className="landing-section-inner" style={{ textAlign: "center" }}>
                    <span className="landing-eyebrow">⬢ Begin Now</span>
                    <h2 className="landing-cta-title">
                        Ready to Map Your{" "}
                        <span className="text-accent">Cognitive Blueprint?</span>
                    </h2>
                    <p className="landing-cta-sub">
                        Create a free account and run your first behavioral experiment in under
                        5 minutes. No prior knowledge required.
                    </p>
                    <button
                        className="landing-btn-primary landing-btn-primary--lg"
                        onClick={handleCTA}
                        id="landing-cta-bottom"
                    >
                        {currentUser ? "Go to Dashboard →" : "Get Started — It's Free →"}
                    </button>
                    {!currentUser && (
                        <p className="landing-cta-signin">
                            Already have an account?{" "}
                            <Link to="/login" className="auth-link">
                                Sign in →
                            </Link>
                        </p>
                    )}
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-footer-brand">
                        <span className="landing-footer-logo">◈ SIM</span>
                        <span className="landing-footer-tagline">
                            Subconscious Influence Mapper · Neural Interface v2
                        </span>
                    </div>
                    <nav className="landing-footer-links">
                        <Link to="/about">About</Link>
                        <Link to="/faq">FAQ</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/privacy">Privacy</Link>
                        <Link to="/terms">Terms</Link>
                    </nav>
                    <p className="landing-footer-copy">
                        © 2026 Subconscious Influence Mapper. Research &amp; Educational Use Only.
                    </p>
                </div>
            </footer>
        </div>
    );
}
