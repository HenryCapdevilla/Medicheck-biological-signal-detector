import React from 'react';
import './navbar.css'
import { Link } from 'react-router-dom';
import Login from './login';
import SocialMediaLogo from './socialMediaLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './profile';

function Navbar() {
  const { isAuthenticated } = useAuth0();
  return (
    <div className="Menu">
      <div className='Logo-menu'>
        <FontAwesomeIcon icon={faBars} className="icon-menu"/>
      </div>
      <ul className="navbar">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="#">Información</Link></li>
        <li><Link to="#">Contactos</Link></li>
        <li><Link to="/videollamada">Conectate ahora</Link></li>
        <SocialMediaLogo src="https://github.com/HenryCapdevilla/Medicheck-biological-signal-detector/blob/629e492b01d9d7ffdd7f7ce63f61b942352c80e7/public/images/Linkedin.svg"/>
        <SocialMediaLogo src="https://github.com/HenryCapdevilla/Medicheck-biological-signal-detector/blob/629e492b01d9d7ffdd7f7ce63f61b942352c80e7/public/images/Github.svg"/>
      </ul>
      {isAuthenticated ? <>
        <Profile/>
        </>
        : <Login/>}
    </div>
  );
}

export default Navbar;