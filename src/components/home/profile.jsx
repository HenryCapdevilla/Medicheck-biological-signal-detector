import React, { useState } from "react";
import './profile.css';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./logout";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [menuVisible, setMenuVisible] = useState(false);

    if (isLoading) {
    return <div>Loading ...</div>;
    }

  // Función para alternar la visibilidad del menú
    const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    };

    return (
    isAuthenticated && (
        <div className="profileUser">
        <img src={user.picture} alt={user.name} className="user-avatar" onClick={toggleMenu} />
        {menuVisible && (
            <div className="user-menu">
                <p>Bienvenido, {user.given_name}</p>
                <p>Correo asociado: {user.email}</p>
                <a href="#historial">Historial Clínico</a>
                <LogoutButton />
            </div>
            )}
        </div>
        )
    );
};

export default Profile;
