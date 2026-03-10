import { useState } from "react";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) return;
        setLoading(true);
        // Simulate async send (no real backend — informational page)
        await new Promise(r => setTimeout(r, 1200));
        setSent(true);
        setLoading(false);
    };

    const contacts = [
        { label: "General Inquiries", value: "hello@sim-research.dev", icon: "◎" },
        { label: "Technical Support", value: "support@sim-research.dev", icon: "⬢" },
        { label: "Research Collaboration", value: "research@sim-research.dev", icon: "⬡" },
        { label: "Privacy & Data", value: "privacy@sim-research.dev", icon: "◈" },
    ];

    return (
        <div className="info-page fade-in">
            <section className="info-hero">
                <span className="info-tag">◎ Contact</span>
                <h1 className="info-hero-title">
                    Get in <span className="text-accent">Touch</span>
                </h1>
                <p className="info-hero-sub">
                    Questions, feedback, research collaboration proposals, or just curious about
                    the platform? We'd love to hear from you.
                </p>
            </section>

            <section className="info-section">
                <div className="contact-layout">
                    {/* ── Form ── */}
                    <div className="info-card contact-form-card">
                        <div className="info-card-head">
                            <span className="info-card-icon" style={{ color: "var(--green)" }}>◧</span>
                            <h2 className="info-card-title">Send a Message</h2>
                        </div>

                        {sent ? (
                            <div className="contact-success fade-in">
                                <span className="contact-success-icon">✓</span>
                                <h3>Message Received</h3>
                                <p>We'll respond within 48 hours. Thank you for reaching out.</p>
                                <button
                                    className="btn-secondary"
                                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                                    style={{ marginTop: 16 }}
                                >
                                    SEND ANOTHER
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-group">
                                    <label className="form-lbl">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        placeholder="Your name"
                                        value={form.name}
                                        onChange={handleChange}
                                        disabled={loading}
                                        id="contact-name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-lbl">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        placeholder="you@domain.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        id="contact-email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-lbl">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="form-input"
                                        placeholder="What's this about?"
                                        value={form.subject}
                                        onChange={handleChange}
                                        disabled={loading}
                                        id="contact-subject"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-lbl">Message</label>
                                    <textarea
                                        name="message"
                                        className="form-input form-textarea"
                                        placeholder="Describe your question or inquiry in detail..."
                                        value={form.message}
                                        onChange={handleChange}
                                        disabled={loading}
                                        id="contact-message"
                                        required
                                        rows={5}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                    id="contact-submit"
                                    style={{ marginTop: 4 }}
                                >
                                    {loading ? (
                                        <span className="btn-loading">
                                            <span className="spinner" /> SENDING
                                        </span>
                                    ) : (
                                        "SEND MESSAGE →"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ── Info ── */}
                    <div className="contact-info">
                        <div className="info-card" style={{ marginBottom: 14 }}>
                            <div className="info-card-head">
                                <span className="info-card-icon" style={{ color: "var(--cyan)" }}>⬢</span>
                                <h3 className="info-card-title">Project Information</h3>
                            </div>
                            <p className="info-card-body">
                                Subconscious Influence Mapper is an open research initiative
                                exploring cognitive bias detection through passive behavioral
                                telemetry in web-based experiments.
                            </p>
                            <div className="info-rule" />
                            <div className="info-kv-list">
                                <div className="info-kv"><span>Platform</span><span>SIM v2.0</span></div>
                                <div className="info-kv"><span>Environment</span><span>Production</span></div>
                                <div className="info-kv"><span>Response Time</span><span>24–48 hours</span></div>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-card-head">
                                <span className="info-card-icon" style={{ color: "var(--purple)" }}>◈</span>
                                <h3 className="info-card-title">Contact Channels</h3>
                            </div>
                            <div className="contact-channels">
                                {contacts.map(({ label, value, icon }) => (
                                    <div className="contact-channel" key={label}>
                                        <span className="contact-channel-icon">{icon}</span>
                                        <div>
                                            <p className="contact-channel-label">{label}</p>
                                            <a href={`mailto:${value}`} className="contact-channel-email">{value}</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
