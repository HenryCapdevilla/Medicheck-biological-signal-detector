import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import Login from './login';
import SocialMediaLogo from './socialMediaLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './profile';

function Navbar() {
  const { isAuthenticated } = useAuth0();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="Menu">
      <div className='Logo-menu'>
        <FontAwesomeIcon 
          icon={faBars} 
          className="icon-menu"
          onClick={toggleMenu} 
        />
      </div>
      <ul className={`navbar ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="#">Información</Link></li>
        <li><Link to="#">Contactos</Link></li>
        <li><Link to="/videollamada">Conéctate</Link></li>
        <SocialMediaLogo src="./images/Github.svg"/>
        <SocialMediaLogo src="./images/Linkedin.svg"/>
        {isAuthenticated ? <Profile/> : <Login/>}
      </ul>
    </div>
  );
}

export default Navbar;
