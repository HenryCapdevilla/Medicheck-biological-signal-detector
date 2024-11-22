import React from 'react';
import { FaVideo, FaVideoSlash } from 'react-icons/fa'; // Importa los íconos de cámara
import Tooltip from '@mui/material/Tooltip';
import './cameraToggleButton.css';

const CameraToggleButton = ({ isCameraActive, toggleCamera }) => {
    return (
        <Tooltip title={isCameraActive ? "Apagar cámara" : "Encender cámara"} arrow>
            {/* Se asegura de que el ref se pase correctamente */}
            <span>
                <button onClick={toggleCamera} className='Button-videocall-camera'>
                    {isCameraActive ? <FaVideoSlash size={24} color="red" /> : <FaVideo size={24} color="white" />}
                </button>
            </span>
        </Tooltip>
    );
};

export default CameraToggleButton;
