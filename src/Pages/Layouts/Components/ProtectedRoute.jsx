import { Navigate } from "react-router-dom";
import { useAuthStateContext } from "@contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStateContext();

  if (loading) return null; // cegah flicker
  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
