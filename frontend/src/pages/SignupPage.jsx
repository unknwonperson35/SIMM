import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { signUp } from "../services/authService";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || !confirm) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirm) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password);
            toast.success("Profile created. Welcome to SIM.");
            navigate("/dashboard");
        } catch (err) {
            const msg =
                err.code === "auth/email-already-in-use"
                    ? "This email is already registered."
                    : err.code === "auth/invalid-email"
                        ? "Invalid email address."
                        : err.code === "auth/weak-password"
                            ? "Password is too weak."
                            : "Registration failed. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#0c1422",
                        color: "#dce8f5",
                        border: "1px solid rgba(255,255,255,0.1)",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 12,
                    },
                }}
            />

            <div className="auth-canvas">
                <div className="auth-grid" />
                <div className="auth-scanline" />
                <div className="auth-orb auth-orb--1" />
                <div className="auth-orb auth-orb--2" />
                <div className="auth-orb auth-orb--3" />
            </div>

            <div className="auth-card slide-up">
                <div className="auth-top">
                    <div className="auth-icon">⬡</div>
                    <h1 className="auth-title">JOIN</h1>
                    <p className="auth-sub">Create your research profile</p>
                </div>

                <div className="auth-rule" />

                <div className="auth-label">
                    <span className="auth-label-text">New Credentials</span>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-lbl">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="user@domain.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={loading}
                            id="signup-email"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-lbl">Passkey (min 6 chars)</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={loading}
                            id="signup-password"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-lbl">Confirm Passkey</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            disabled={loading}
                            id="signup-confirm"
                            autoComplete="new-password"
                        />
                    </div>

                    <div style={{
                        padding: "12px 16px",
                        background: "rgba(10,255,157,0.04)",
                        border: "1px solid rgba(10,255,157,0.15)",
                        borderRadius: 10,
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 11,
                        color: "rgba(10,255,157,0.7)",
                        lineHeight: 1.6,
                    }}>
                        ◎ By registering you consent to behavioral telemetry
                        collection during experiments for scientific analysis.
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        id="signup-submit"
                        style={{ marginTop: 4 }}
                    >
                        {loading ? (
                            <span className="btn-loading">
                                <span className="spinner" /> CREATING PROFILE
                            </span>
                        ) : (
                            "CREATE RESEARCH PROFILE →"
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have access?{" "}
                    <Link to="/login" className="auth-link">
                        Sign in →
                    </Link>
                </p>
            </div>
        </div>
    );
}
