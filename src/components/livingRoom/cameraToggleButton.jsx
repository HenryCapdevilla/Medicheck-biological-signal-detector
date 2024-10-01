import React from 'react';
import { FaVideo, FaVideoSlash } from 'react-icons/fa'; // Importa los íconos de cámara
import './cameraToggleButton.css'

const CameraToggleButton = ({ isCameraActive, toggleCamera }) => {
    return (
        <button onClick={toggleCamera} className='Button-videocall-camera'>
            {isCameraActive ? <FaVideoSlash size={24} color="red" /> : <FaVideo size={24} color="white" />}
        </button>
    );
};

export default CameraToggleButton;

