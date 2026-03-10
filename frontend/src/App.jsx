import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthNavbar, { PublicNavbar } from "./components/Navbar";
import ChatBot from "./components/ChatBot";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ExperimentPage from "./pages/ExperimentPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import { useAuth } from "./contexts/AuthContext";

// Routes where the auth navbar is shown (protected/app shell pages)
const AUTH_NAV_PATHS = ["/dashboard", "/experiment"];

function AppRoutes() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show minimal loading state while Firebase resolves auth
  if (loading) {
    return (
      <div className="loading-state" style={{ height: "100vh" }}>
        <div className="loading-ring" />
      </div>
    );
  }

  // Determine which navbar to render
  const isAuthRoute = AUTH_NAV_PATHS.some((p) => location.pathname.startsWith(p));

  return (
    <>
      {/* Navbar — context-aware */}
      {isAuthRoute && currentUser ? <AuthNavbar /> : <PublicNavbar />}

      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* ── Auth Routes — redirect to dashboard if already logged in ── */}
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <SignupPage />}
        />

        {/* ── Protected Routes ── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/experiment"
          element={
            <ProtectedRoute>
              <ExperimentPage />
            </ProtectedRoute>
          }
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ── AI ChatBot — global, available to ALL users ── */}
      <ChatBot />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
