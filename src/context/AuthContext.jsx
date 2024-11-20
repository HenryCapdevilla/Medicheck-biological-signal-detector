import { createContext, useContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest, logoutRequest, upClinicalHRequest, downClinicalHRequest, updateClinicalHRequest } from '../api/auth.js';
import Cookies from 'js-cookie';

export const AuthContext = createContext()

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export const AuthProvider = ({ children }) => {
  // Cambia "Children" a "children"
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error.response.data);
        if (Array.isArray(error.response.data)) {
            console.log(error.response.data)
            setErrors(error.response.data);
        } else {
            setErrors([error.response.data]); // Asegúrate de que sea un array
        }
    }
  };

  const signin = async (user) => {
    try {
        const res = await loginRequest(user);
        console.log(res);
        setIsAuthenticated(true);
        setUser(res.data);
        return true; // Retorna true para indicar que el inicio de sesión fue exitoso
    } catch (error) {
        if (Array.isArray(error.response.data)) {
            setErrors(error.response.data);
        } else {
            setErrors([error.response.data]); // Asegúrate de que sea un array
        }
        return false; // Retorna false para indicar que hubo un error
    }
};

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const res = await logoutRequest();
      if (res.status === 200) {
        // Eliminar el token de las cookies
        Cookies.remove("token");
        setUser(null);
        setIsAuthenticated(false);
        console.log("Cierre de sesión exitoso");
      } else {
        console.log("Hubo un problema al cerrar sesión");
      }
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

    // Subir nueva historia clínica
    const handleUploadHistory = async (data) => {
      try {
          const res = await upClinicalHRequest(data);
          console.log("Historia clínica subida:", res.data);
      } catch (error) {
          console.error("Error al subir historia clínica:", error);
      }
  };

  // Descargar historia clínica
  const handleDownloadHistory = async () => {
      try {
          const response = await downClinicalHRequest();
          console.log("Datos de la historia clínica:", response.data);
      } catch (error) {
          console.error("Error al descargar historia clínica:", error);
      }
  };

  // Actualizar historia clínica
  const handleUpdateHistory = async (data) => {
      try {
          const response = await updateClinicalHRequest(data);
          console.log("Historia clínica actualizada:", response.data);
      } catch (error) {
          console.error("Error al actualizar historia clínica:", error);
      }
  };

  //Para eliminar los errores mostrados luego de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const checkLogin = async () => {
      const cookies = Cookies.get();
      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }
      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) {
          // Si no hay datos en la respuesta, el usuario no está autenticado
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        } else {
          // Si hay datos, el usuario está autenticado
          setIsAuthenticated(true);
          setUser(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.log('Error in token verification:', error.response || error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        handleUploadHistory,
        handleDownloadHistory,
        handleUpdateHistory,
        loading,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children} {/* Cambia "Children" a "children" */}
    </AuthContext.Provider>
  );
};
