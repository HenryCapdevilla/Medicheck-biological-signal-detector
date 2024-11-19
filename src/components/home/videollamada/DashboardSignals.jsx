import React, { useState } from 'react';
import { HeartIcon, SunIcon, GlobeAltIcon } from '@heroicons/react/outline'; // Importamos íconos desde Heroicons
import './DashboardSignals.css';

const UserCard = ({ heartRate, spO2, lux }) => {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <div className="fitCard">
      {/* Card de Frecuencia Cardiaca */}
      <div className="statBox" onClick={handleClick}>
        <HeartIcon className="icon" />
        <p className={`statText ${clicked ? 'show' : ''}`}>{heartRate} bpm</p>
      </div>

      {/* Card de Oxígeno en Sangre */}
      <div className="statBox" onClick={handleClick}>
        <GlobeAltIcon className="icon" />
        <p className={`statText ${clicked ? 'show' : ''}`}>{spO2}% O₂</p>
      </div>

      {/* Card de Luz Solar */}
      <div className="statBox" onClick={handleClick}>
        <SunIcon className="icon" />
        <p className={`statText ${clicked ? 'show' : ''}`}> lux</p>
      </div>
    </div>
  );
};

export default UserCard;
