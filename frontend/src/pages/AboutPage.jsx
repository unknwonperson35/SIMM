export default function AboutPage() {
    const stack = [
        { name: "React 19", role: "Frontend Framework", color: "var(--cyan)" },
        { name: "Firebase Auth", role: "Authentication", color: "var(--orange)" },
        { name: "Cloud Firestore", role: "Database", color: "var(--yellow)" },
        { name: "Recharts", role: "Data Visualization", color: "var(--purple)" },
        { name: "Vite 7", role: "Build Tool", color: "var(--green)" },
        { name: "CSS Variables", role: "Design System", color: "var(--text-mid)" },
    ];

    const biasTypes = [
        {
            title: "Framing Bias",
            color: "var(--green)",
            icon: "◧",
            desc: "Tendency to be influenced by how information is presented — gain vs. loss framing, positive vs. negative language — rather than the underlying facts.",
        },
        {
            title: "Authority Bias",
            color: "var(--orange)",
            icon: "◨",
            desc: "Overweighting the opinions of perceived authority figures — institutions, credentials, titles — even when evidence from other sources is equally valid.",
        },
        {
            title: "Emotional Bias",
            color: "var(--purple)",
            icon: "◫",
            desc: "Allowing emotionally charged language, personal narratives, and vivid imagery to override statistical reasoning and objective data.",
        },
        {
            title: "Confirmation Bias",
            color: "var(--cyan)",
            icon: "◪",
            desc: "Seeking, interpreting, and remembering information that confirms existing beliefs while discounting contradictory evidence.",
        },
    ];

    return (
        <div className="info-page fade-in">
            {/* ── Hero ── */}
            <section className="info-hero">
                <span className="info-tag">◎ About the Platform</span>
                <h1 className="info-hero-title">
                    Mapping the Hidden Architecture<br />
                    of <span className="text-accent">Human Judgment</span>
                </h1>
                <p className="info-hero-sub">
                    Subconscious Influence Mapper (SIM) is a behavioral psychology research platform
                    that runs structured cognitive experiments to detect, quantify, and visualize
                    unconscious biases in human decision-making.
                </p>
            </section>

            {/* ── What is SIM ── */}
            <section className="info-section">
                <div className="info-card info-card--wide">
                    <div className="info-card-head">
                        <span className="info-card-icon" style={{ color: "var(--green)" }}>⬡</span>
                        <h2 className="info-card-title">What is SIM?</h2>
                    </div>
                    <p className="info-card-body">
                        SIM is a full-stack web application designed to run automated behavioral psychology
                        experiments. Participants answer carefully crafted questions while the platform
                        silently records behavioral telemetry — response time, mouse movement patterns,
                        hover duration, option-switching frequency, and scroll behavior.
                    </p>
                    <p className="info-card-body" style={{ marginTop: 12 }}>
                        This telemetry is fed into a multi-dimensional scoring algorithm that produces
                        four discrete cognitive bias scores, combined into a single <strong>Manipulation
                            Vulnerability Index (MVI)</strong> — your overall susceptibility to subconscious
                        influence.
                    </p>
                </div>
            </section>

            {/* ── Bias Types ── */}
            <section className="info-section">
                <h2 className="info-section-title">The Four Cognitive Biases</h2>
                <p className="info-section-sub">
                    SIM experiments are designed to surface four primary categories of cognitive bias,
                    each measured through dedicated question sets and behavioral signals.
                </p>
                <div className="info-grid">
                    {biasTypes.map(({ title, color, icon, desc }) => (
                        <div className="info-card" key={title}>
                            <div className="info-card-head">
                                <span className="info-card-icon" style={{ color }}>{icon}</span>
                                <h3 className="info-card-title" style={{ color }}>{title}</h3>
                            </div>
                            <p className="info-card-body">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── How it Works ── */}
            <section className="info-section">
                <h2 className="info-section-title">How Experiments Work</h2>
                <div className="info-steps">
                    {[
                        { n: "01", title: "Session Creation", body: "A new experiment session is created in Firestore, linked to your authenticated user account." },
                        { n: "02", title: "Question Presentation", body: "12 psychologically-designed questions are served one at a time, each targeting a specific bias category." },
                        { n: "03", title: "Telemetry Recording", body: "As you interact, the system records response time, mouse distance, hover duration, option switches, scroll pauses, and confidence ratings." },
                        { n: "04", title: "Bias Scoring", body: "After completion, a multi-signal algorithm calculates scores for each of the four bias categories (0–100 scale)." },
                        { n: "05", title: "Index Calculation", body: "The four scores are averaged into a Manipulation Vulnerability Index, saved to your profile." },
                        { n: "06", title: "Analytics", body: "Your dashboard shows your bias profile breakdown, historical trends, and allows CSV export." },
                    ].map(({ n, title, body }) => (
                        <div className="info-step" key={n}>
                            <span className="info-step-num">{n}</span>
                            <div>
                                <h4 className="info-step-title">{title}</h4>
                                <p className="info-step-body">{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── MVI ── */}
            <section className="info-section">
                <div className="info-card info-card--highlight">
                    <div className="info-card-head">
                        <span className="info-card-icon" style={{ color: "var(--yellow)" }}>◈</span>
                        <h2 className="info-card-title">The Manipulation Vulnerability Index</h2>
                    </div>
                    <p className="info-card-body">
                        The MVI is a composite score (0–100) representing your overall susceptibility to
                        subconscious influence. It is calculated as the arithmetic mean of your four
                        individual bias scores.
                    </p>
                    <div className="mvi-scale">
                        {[
                            { range: "0–24", label: "MINIMAL", color: "var(--green)" },
                            { range: "25–49", label: "LOW", color: "var(--yellow)" },
                            { range: "50–74", label: "MODERATE", color: "var(--orange)" },
                            { range: "75–100", label: "HIGH", color: "var(--red)" },
                        ].map(({ range, label, color }) => (
                            <div className="mvi-band" key={label} style={{ borderColor: color }}>
                                <span className="mvi-band-range" style={{ color }}>{range}</span>
                                <span className="mvi-band-label" style={{ color }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Tech Stack ── */}
            <section className="info-section">
                <h2 className="info-section-title">Technology Stack</h2>
                <div className="tech-grid">
                    {stack.map(({ name, role, color }) => (
                        <div className="tech-card" key={name}>
                            <span className="tech-name" style={{ color }}>{name}</span>
                            <span className="tech-role">{role}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
