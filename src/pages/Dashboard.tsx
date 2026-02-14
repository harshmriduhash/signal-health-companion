import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { hasRole } = useAuth();

  if (hasRole("admin")) return <Navigate to="/admin" replace />;
  if (hasRole("doctor")) return <Navigate to="/doctor" replace />;
  return <Navigate to="/patient" replace />;
}
