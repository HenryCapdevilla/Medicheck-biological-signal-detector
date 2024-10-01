import React from 'react'
import './login.css'
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
    const { loginWithRedirect } = useAuth0();
    
    return (
        <div className='Button_login'>
            <button onClick={() => loginWithRedirect()}>Iniciar Sesión</button>
        </div>
    )
};

export default Login
