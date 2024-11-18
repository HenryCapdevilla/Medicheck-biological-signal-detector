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
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/about">Acerca de</Link></li>
        {isAuthenticated && user?.role === 'paciente' && (
          <li><Link to="/videollamada">Conéctate</Link></li>
        )}
        
        {isAuthenticated && (user?.role === 'medico' || user?.role === 'admin') && (
          <>
            <li><Link to="/Profile">Perfil</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/videollamada">Conéctate</Link></li>
          </>
        )}
      </ul>

      <div className="auth-buttons">
        {isAuthenticated ? <LogoutButton /> : <LoginButton text="Login" />}
      </div>
    </div>
  );
}

export default Navbardefault;
