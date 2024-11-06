import React from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/register'); // Ajusta la ruta según tu configuración de rutas
    };

    return (
        <div className='Button_login'>
            <button onClick={handleRedirect}>Ir a Registro</button>
        </div>
    );
};

export default Login;
