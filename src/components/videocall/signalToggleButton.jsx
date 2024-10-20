import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat} from '@fortawesome/free-solid-svg-icons'; // Íconos de señales
import './signalToggleButton.css';

const SignalToggleButton = ({ toggleSignal }) => {
    const [isSignalActive, setIsSignalActive] = useState(false);

    const handleToggle = () => {
        const newState = !isSignalActive;
        setIsSignalActive(newState);
        toggleSignal(newState); // Notificamos el estado al componente padre
    };

    return (
        <div className="signal-button-container">
            {/* Botón con estado dinámico */}
            <button onClick={handleToggle} className='signal-toggle-button'>
                {/* Cambiar el ícono dependiendo del estado */}
                {isSignalActive ? ( <FontAwesomeIcon icon={faHeartbeat} className="signal-icon" color="red"/>) : (<FontAwesomeIcon icon={faHeartbeat} className="signal-icon" color="white"/>)}
            </button>
        </div>
    );
};

export default SignalToggleButton;
