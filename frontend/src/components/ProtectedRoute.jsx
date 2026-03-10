import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="auth-loading">
                <div className="loading-ring" />
            </div>
        );
    }

    return currentUser ? children : <Navigate to="/login" replace />;
}
