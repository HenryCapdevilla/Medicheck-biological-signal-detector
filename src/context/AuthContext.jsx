import { createContext, useContext, useEffect, useState } from "react";
import { 
  registerRequest, 
  loginRequest, 
  verifyTokenRequest, 
  logoutRequest, 
  upClinicalHRequest, 
  downClinicalHRequest, 
  updateClinicalHRequest 
} from '../api/auth.js';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
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
            console.log(error.response?.data);
            setErrors(Array.isArray(error.response?.data) ? error.response.data : [error.response?.data || "Unexpected error occurred"]);
        }
    };

    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            console.log(res);
            setIsAuthenticated(true);
            setUser(res.data);
            return true;
        } catch (error) {
            setErrors(Array.isArray(error.response?.data) ? error.response.data : [error.response?.data || "Unexpected error occurred"]);
            return false;
        }
    };

    const logout = async () => {
        try {
            const res = await logoutRequest();
            if (res.status === 200) {
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

    const handleUploadHistory = async (data) => {
        try {
            const res = await upClinicalHRequest(data);
            console.log("Historia clínica subida:", res.data);
        } catch (error) {
            console.error("Error al subir historia clínica:", error);
        }
    };

    const handleDownloadHistory = async () => {
        try {
            const response = await downClinicalHRequest();
            console.log("Datos de la historia clínica:", response.data);
        } catch (error) {
            console.error("Error al descargar historia clínica:", error);
        }
    };

    const handleUpdateHistory = async (data) => {
        try {
            const response = await updateClinicalHRequest(data);
            console.log("Historia clínica actualizada:", response.data);
        } catch (error) {
            console.error("Error al actualizar historia clínica:", error);
        }
    };

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
            const token = Cookies.get("token");
            if (!token) {
                setUser(null);
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }
            try {
                const res = await verifyTokenRequest(token);
                if (res.data) {
                    setUser(res.data);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error verifying token:", error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
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
            {children}
        </AuthContext.Provider>
    );
};
