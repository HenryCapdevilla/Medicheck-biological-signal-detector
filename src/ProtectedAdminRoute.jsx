import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <h1>Loading...</h1>;
  
  // Si no está autenticado, redirige a la página de inicio de sesión
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Redirige a la página principal si el rol es 'paciente' o 'medico'
  if (user?.role === 'paciente' || user?.role === 'medico') return <Navigate to="/" replace />;
  
  // Renderiza el contenido de la ruta si el usuario tiene permisos especiales
  return <Outlet />;
}

export default ProtectedRoute;
