import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default RequireAuth;
