import React, { useState } from 'react';
import { HeartIcon, GlobeAltIcon } from '@heroicons/react/outline'; // Íconos para BPM y SPO2
import './DashboardSignals.css';

const UserCard = ({ heartRate, spO2 }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <div className="user-card-container">
      {/* Card de Frecuencia Cardiaca */}
      <div className="card-container" onClick={handleClick}>
        <div className="card-content">
          <HeartIcon className="icon mb-2" />
          <p className={`statText ${clicked ? 'show' : ''}`}>{heartRate} bpm</p>
        </div>
      </div>

      {/* Card de SPO2 */}
      <div className="card-container" onClick={handleClick}>
        <div className="card-content">
          <GlobeAltIcon className="icon mb-2" />
          <p className={`statText ${clicked ? 'show' : ''}`}>{spO2}% O₂</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
