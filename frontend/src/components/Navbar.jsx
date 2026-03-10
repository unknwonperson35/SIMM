import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { logOut } from "../services/authService";

/* ─────────────────────────────────────────────────────────────────────
   PUBLIC NAVBAR — shown on landing page and public info pages
   ───────────────────────────────────────────────────────────────────── */
const PUBLIC_NAV_LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" },
];

export function PublicNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <nav className="navbar navbar--public" ref={menuRef}>
            {/* ── Brand ── */}
            <Link to="/" className="navbar-brand" style={{ textDecoration: "none" }}>
                <div className="brand-glyph">◈</div>
                <span className="brand-name">SIM</span>
                <span className="brand-tag">Neural Interface v2</span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="navbar-nav navbar-nav--desktop">
                {PUBLIC_NAV_LINKS.map(({ to, label, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            isActive ? "nav-btn nav-btn--active" : "nav-btn"
                        }
                        id={`pub-nav-${label.toLowerCase()}`}
                    >
                        {label}
                    </NavLink>
                ))}

                <span className="nav-divider" />

                {currentUser ? (
                    <Link to="/dashboard" className="nav-btn-cta" id="pub-nav-dashboard">
                        Dashboard →
                    </Link>
                ) : (
                    <>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? "nav-btn nav-btn--active" : "nav-btn"
                            }
                            id="pub-nav-signin"
                        >
                            Sign In
                        </NavLink>
                        <Link to="/signup" className="nav-btn-cta" id="pub-nav-get-started">
                            Get Started
                        </Link>
                    </>
                )}
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
                className="nav-hamburger"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle navigation menu"
                id="pub-nav-hamburger"
            >
                <span className={`ham-line${menuOpen ? " ham-line--open-1" : ""}`} />
                <span className={`ham-line${menuOpen ? " ham-line--open-2" : ""}`} />
                <span className={`ham-line${menuOpen ? " ham-line--open-3" : ""}`} />
            </button>

            {/* ── Mobile Dropdown ── */}
            {menuOpen && (
                <div className="mobile-menu fade-in">
                    {PUBLIC_NAV_LINKS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                isActive ? "mobile-nav-btn mobile-nav-btn--active" : "mobile-nav-btn"
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </NavLink>
                    ))}
                    <div className="mobile-menu-footer">
                        {currentUser ? (
                            <Link
                                to="/dashboard"
                                className="nav-btn-cta"
                                onClick={() => setMenuOpen(false)}
                            >
                                Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="mobile-nav-btn"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="nav-btn-cta"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

/* ─────────────────────────────────────────────────────────────────────
   AUTH NAVBAR — shown on protected pages for authenticated users
   ───────────────────────────────────────────────────────────────────── */
const AUTH_NAV_LINKS = [
    { to: "/dashboard", label: "Dashboard", end: true, icon: "⬡" },
    { to: "/experiment", label: "Experiment", end: false, icon: "⬢" },
    { to: "/about", label: "About", end: false, icon: "◎" },
    { to: "/faq", label: "FAQ", end: false, icon: "◧" },
    { to: "/contact", label: "Contact", end: false, icon: "◨" },
];

export default function AuthNavbar() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logOut();
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <nav className="navbar" ref={menuRef}>
            {/* ── Brand ── */}
            <NavLink to="/dashboard" className="navbar-brand" style={{ textDecoration: "none" }}>
                <div className="brand-glyph">◈</div>
                <span className="brand-name">SIM</span>
                <span className="brand-tag">Neural Interface v2</span>
            </NavLink>

            {/* ── Desktop Nav ── */}
            <div className="navbar-nav navbar-nav--desktop">
                {AUTH_NAV_LINKS.map(({ to, label, end, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            isActive ? "nav-btn nav-btn--active" : "nav-btn"
                        }
                        id={`nav-${label.toLowerCase()}`}
                    >
                        {icon} {label}
                    </NavLink>
                ))}

                <span className="nav-divider" />

                <div className="nav-user">
                    <span className="nav-dot" />
                    <span title={currentUser?.email}>
                        {currentUser?.email?.split("@")[0]}
                    </span>
                </div>

                <button className="btn-logout" onClick={handleLogout} id="btn-logout">
                    LOGOUT
                </button>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
                className="nav-hamburger"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle navigation menu"
                id="nav-hamburger"
            >
                <span className={`ham-line${menuOpen ? " ham-line--open-1" : ""}`} />
                <span className={`ham-line${menuOpen ? " ham-line--open-2" : ""}`} />
                <span className={`ham-line${menuOpen ? " ham-line--open-3" : ""}`} />
            </button>

            {/* ── Mobile Dropdown ── */}
            {menuOpen && (
                <div className="mobile-menu fade-in">
                    {AUTH_NAV_LINKS.map(({ to, label, end, icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                isActive ? "mobile-nav-btn mobile-nav-btn--active" : "mobile-nav-btn"
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            <span>{icon}</span> {label}
                        </NavLink>
                    ))}
                    <div className="mobile-menu-footer">
                        <span className="nav-user" style={{ fontSize: 11 }}>
                            <span className="nav-dot" />
                            {currentUser?.email}
                        </span>
                        <button className="btn-logout" onClick={handleLogout}>
                            LOGOUT
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
