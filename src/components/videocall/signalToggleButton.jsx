import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons'; // Íconos de señales
import Tooltip from '@mui/material/Tooltip'; // Importa Tooltip
import './signalToggleButton.css';

const SignalToggleButton = ({ toggleSignal }) => {
    const [isSignalActive, setIsSignalActive] = useState(false);
    const buttonRef = useRef(null); // Usamos useRef para hacer referencia al botón

    const handleToggle = () => {
        const newState = !isSignalActive;
        setIsSignalActive(newState);
        toggleSignal(newState); // Notificamos el estado al componente padre
    };

    return (
        <Tooltip title={isSignalActive ? "Desactivar señal" : "Activar señal"} arrow>
            <span> {/* El Tooltip necesita envolver el componente, por lo que usamos el span para pasar el ref correctamente */}
                <button
                    ref={buttonRef}
                    onClick={handleToggle}
                    className='signal-toggle-button'
                >
                    {/* Cambiar el ícono dependiendo del estado */}
                    {isSignalActive ? (
                        <FontAwesomeIcon icon={faHeartbeat} className="signal-icon" color="red"/>
                    ) : (
                        <FontAwesomeIcon icon={faHeartbeat} className="signal-icon" color="white"/>
                    )}
                </button>
            </span>
        </Tooltip>
    );
};

export default SignalToggleButton;
