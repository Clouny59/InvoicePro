import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/dashboard" />;

  return children;
};

export default RequireAdmin;
