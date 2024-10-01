import React from 'react';
import './socialMediaLogo.css'
const SocialMediaLogo = (props) => {
  return (
    <div className="socials-1">
        <img src={props.src} alt="Social Media Logo" />
    </div>
  );
};

export default SocialMediaLogo;
