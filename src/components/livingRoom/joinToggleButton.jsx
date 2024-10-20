import React from 'react';
import { FaPhoneAlt } from 'react-icons/fa'; // Ícono de celular
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './joinToggleButton.css';

const JoinToggleButton = ({ roomID, isCameraActive, isMicActive }) => {
    const navigate = useNavigate(); // Hook para navegar

    const handleJoinClick = () => {
        navigate(`/videocall/${roomID}`, { state: { cameraActive: isCameraActive, micActive: isMicActive } }); // Redirige a la ruta con roomID
    };

    // Redirigir incluyendo el estado de la cámara y el micrófono

    return (
        <button onClick={handleJoinClick} className='join-call-button'>
            <FaPhoneAlt size={20} color="white" style={{ marginRight: '8px' }} />
            Unirse a la llamada
        </button>
    );
};

export default JoinToggleButton;

