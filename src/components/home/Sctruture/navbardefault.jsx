import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from '../Buttons/ButtonLogout';
import LoginButton from '../Buttons/login';
import { useAuth } from '../../../context/AuthContext';

function Navbardefault() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="Menu">
      <div className="Logo-menu">
        <FontAwesomeIcon 
          icon={faBars} 
          className="icon-menu"
          onClick={toggleMenu} 
        />
      </div>
      <ul className={`navbar ${isMenuOpen ? 'active' : ''}`}>
        {/* Enlace común para todos */}
        <li><Link to="/">Inicio</Link></li>

        {/* Condicionales según el estado de autenticación y rol */}
        {!isAuthenticated && (
          <LoginButton text="Login" />
        )}
        
        {isAuthenticated && user?.role === 'paciente' && (
          <>
            <li><Link to="/videollamada">Conéctate</Link></li>
            <LogoutButton />
          </>
        )}
        
        {isAuthenticated && user?.role === 'medico' && (
          <>
            <li><Link to="/Profile">Perfil</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/videollamada">Conéctate</Link></li>
            <LogoutButton />
          </>
        )}

        {isAuthenticated && user?.role === '' && (
          <>
            <li><Link to="/Profile">Perfil</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/videollamada">Conéctate</Link></li>
            <LogoutButton />
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbardefault;
