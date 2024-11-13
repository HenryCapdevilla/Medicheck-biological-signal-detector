import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneSlash } from 'react-icons/fa';
import './hanguptoggleButton.css';
import { VideoContext } from '../../../context/videoProvider';

const HangUpButton = ({ socket, roomID, onHangUp }) => {
    const navigate = useNavigate();
    const { stopStream } = useContext(VideoContext);

    const handleHangUp = () => {
        if (!socket) {
            console.error('Socket is not initialized.');
            return;
        }
        // Emitir el evento de colgar la llamada
        socket.emit('hang-up', roomID);

        // Detener el stream de video y audio
        stopStream();

        // Cambiar el estado en el componente padre para manejar la finalización de la llamada
        onHangUp();

        // Redirigir a la página de inicio
        navigate('/');
    };

    return (
        <button onClick={handleHangUp} className='Button-videocall-hangup'>
            <FaPhoneSlash size={24} color="red" />
        </button>
    );
};

export default HangUpButton;
