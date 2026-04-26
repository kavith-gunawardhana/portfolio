import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center font-mono text-cyber-cyan">
        authenticating…
      </div>
    );
  }
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
