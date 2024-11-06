import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import Login from './login';
import SocialMediaLogo from './socialMediaLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
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
        <li><Link to="/Profile">Perfil</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/videollamada">Conéctate</Link></li>
        <SocialMediaLogo src="./images/Github.svg"/>
        <SocialMediaLogo src="./images/Linkedin.svg"/>
        <Login/>
      </ul>
    </div>
  );
}

export default Navbar;
