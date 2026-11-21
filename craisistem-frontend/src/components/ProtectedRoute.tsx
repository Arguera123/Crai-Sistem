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

/**
 * Redirige a la primera pantalla a la que el usuario tiene acceso segun sus roles.
 * Evita el ciclo infinito "/" -> "/learning-center/prestamos" -> "/" para usuarios
 * que no tienen el rol learningcenter (p. ej. solo recepcion o bibliotecario).
 */
export const HomeRedirect = () => {
  const { user } = useAuth();
  const roles: string[] = (user?.roles || []).map((r: string) => r.toLowerCase());
  const isAdmin = roles.includes(Roles.ADMIN);

  if (isAdmin || roles.includes(Roles.LEARNING_CENTER)) return <Navigate to="/learning-center/prestamos" replace />;
  if (roles.includes(Roles.RECEPTION)) return <Navigate to="/lockers/prestamos" replace />;
  if (roles.includes(Roles.LIBRARIAN)) return <Navigate to="/user/manejo" replace />;

  return (
    <div style={{ paddingTop: 140, textAlign: "center", fontFamily: "sans-serif" }}>
      Su usuario no tiene un rol asignado para usar el sistema. Contacte al administrador.
    </div>
  );
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