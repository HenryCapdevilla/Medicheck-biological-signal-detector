import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneSlash } from 'react-icons/fa';
import './hanguptoggleButton.css';
import { VideoContext } from '../../context/videoProvider';
const HangUpButton = ({ socket, roomID }) => {

    const navigate = useNavigate(); // Usar useNavigate

    const { stopStream } = useContext(VideoContext);

    const handleHangUp = () => {
        if (!socket) {
            console.error('Socket is not initialized.');
            return; // Salir si el socket no está disponible
        }
        // Emitir el evento de colgar la llamada
        socket.emit('hang-up', roomID); // Cambiado a 'hang-up'
        // Detener el stream de video y audio
        stopStream();
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