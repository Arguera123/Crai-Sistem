import { Navigate, Outlet } from "react-router-dom";
import { Roles } from "../utils/user-states.constants";
import { useAuth } from "../hooks/authProvider";


export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const token = localStorage.getItem("token");

  if (isLoading) return null; 

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const RoleGuard = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user } = useAuth();

  const userRoles = user?.roles || [];

  const isAdmin = userRoles.some(
    (r: string) => r.toLowerCase() === Roles.ADMIN.toLowerCase()
  );

  const hasAccess = isAdmin || allowedRoles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};