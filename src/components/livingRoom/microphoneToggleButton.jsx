import React from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import './microphoneToggleButton.css';

// Usamos forwardRef para pasar el ref al botón
const MicrophoneToggleButton = React.forwardRef(({ isMicActive, toggleMicrophone }, ref) => {
    return (
        <button 
            onClick={toggleMicrophone} 
            className='Button-videocall-microphone' 
            ref={ref} // Pasamos el ref aquí
        >
            {isMicActive ? <FaMicrophoneSlash size={24} color="red" /> : <FaMicrophone size={24} color="white"/>}
        </button>
    );
});

export default MicrophoneToggleButton;
