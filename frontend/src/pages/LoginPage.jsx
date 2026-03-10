import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { logIn, resetPassword } from "../services/authService";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        if (isResetMode) {
            setLoading(true);
            try {
                await resetPassword(email);
                toast.success("Password reset email sent. Please check your inbox.");
                setIsResetMode(false);
                setPassword("");
            } catch (err) {
                const msg = err.code === "auth/user-not-found"
                    ? "No account found with this email."
                    : "Failed to send reset email. Please try again.";
                toast.error(msg);
            } finally {
                setLoading(false);
            }
            return;
        }

        if (!password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            await logIn(email, password);
            navigate("/dashboard");
        } catch (err) {
            const msg =
                err.code === "auth/invalid-credential"
                    ? "Invalid credentials. Access denied."
                    : err.code === "auth/too-many-requests"
                        ? "Too many attempts. Try again later."
                        : err.code === "auth/user-not-found"
                            ? "No account found with this email."
                            : "Authentication failed. Please try again.";
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

            {/* Atmospheric background */}
            <div className="auth-canvas">
                <div className="auth-grid" />
                <div className="auth-scanline" />
                <div className="auth-orb auth-orb--1" />
                <div className="auth-orb auth-orb--2" />
                <div className="auth-orb auth-orb--3" />
            </div>

            <div className="auth-card slide-up">
                <div className="auth-top">
                    <div className="auth-icon">◈</div>
                    <h1 className="auth-title">SIM</h1>
                    <p className="auth-sub">Subconscious Influence Mapper</p>
                </div>

                <div className="auth-rule" />

                <div className="auth-label">
                    <span className="auth-label-text">System Access</span>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-lbl">Identifier</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="user@domain.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={loading}
                            id="login-email"
                            autoComplete="email"
                        />
                    </div>

                    {!isResetMode && (
                        <div className="form-group">
                            <label className="form-lbl" style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Passkey</span>
                                <button
                                    type="button"
                                    onClick={() => setIsResetMode(true)}
                                    style={{ background: "none", border: "none", color: "rgba(16, 208, 255, 0.7)", fontSize: "12px", cursor: "pointer", padding: 0 }}
                                >
                                    Forgot Passkey?
                                </button>
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                                id="login-password"
                                autoComplete="current-password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        id="login-submit"
                        style={{ marginTop: 8 }}
                    >
                        {loading ? (
                            <span className="btn-loading">
                                <span className="spinner" /> {isResetMode ? "SENDING..." : "AUTHENTICATING"}
                            </span>
                        ) : isResetMode ? (
                            "SEND RESET LINK →"
                        ) : (
                            "INITIATE SESSION →"
                        )}
                    </button>

                    {isResetMode && (
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setIsResetMode(false)}
                            disabled={loading}
                            style={{ marginTop: 12, width: "100%" }}
                        >
                            ← BACK TO LOGIN
                        </button>
                    )}
                </form>

                <p className="auth-footer">
                    No access?{" "}
                    <Link to="/signup" className="auth-link">
                        Register credentials →
                    </Link>
                </p>
            </div>
        </div>
    );
}
