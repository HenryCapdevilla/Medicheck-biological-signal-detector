import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoContext } from '../../context/videoProvider';
import CameraToggleButton from './cameraToggleButton';
import { useAuth } from "../../context/AuthContext";

import MicrophoneToggleButton from './microphoneToggleButton';
import CameraLuminosityCheck from './CameraLuminosityCheck';
import './userCamaraContainer.css';

const ButtonCamera = () => {
    const { roomID } = useParams(); 
    const navigate = useNavigate(); 
    const { isCameraActive, isMicActive, toggleCamera, toggleMicrophone, videoRef, startStream, stopStream } = useContext(VideoContext);
    const { user } = useAuth();
    const [modalVisible, setModalVisible] = useState(user?.role === 'paciente'); // Solo muestra si es paciente

    useEffect(() => {
        if (isCameraActive || isMicActive) {
            startStream(isCameraActive, isMicActive);
        } else {
            stopStream();
        }

        return () => stopStream();
    }, [isCameraActive, isMicActive, startStream, stopStream]);

    const joinCall = () => {
        navigate(`/videollamada/${roomID}`);
    };

    const handleAccept = () => setModalVisible(false);
    const handleReject = () => navigate(-1);

    return (
        <div className="User-Content">
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Consentimiento para el Uso de Datos</h2>
                        <p>
                            Durante esta videollamada, se procesarán datos personales relacionados con signos vitales 
                            únicamente con fines de diagnóstico. ¿Desea continuar?
                        </p>
                        <div className="modal-buttons">
                            <button onClick={handleAccept} className="accept-button">Aceptar</button>
                            <button onClick={handleReject} className="reject-button">Rechazar</button>
                        </div>
                    </div>
                </div>
            )}
            {!modalVisible && (
                <div className='body-livingroom'>
                    <div className='video-container'>
                        {!isCameraActive && <h1 className="camera-off-text">La cámara está desactivada</h1>}
                        <video ref={videoRef} className="video-self" autoPlay muted playsInline></video>
                        <div className="Display-buttons">
                            <div className='Background-Display-Buttons'>
                                <CameraToggleButton isCameraActive={isCameraActive} toggleCamera={toggleCamera} />
                                <MicrophoneToggleButton isMicActive={isMicActive} toggleMicrophone={toggleMicrophone} />
                            </div>
                        </div>
                    </div>
                    <div className='user-input-videocall'>
                        <h1 className="text-general">Ya puedes ingresar a la reunión</h1>
                        <button onClick={joinCall} className="join-call-button">Unirse a la Videollamada</button>
                        <h1 className="text-general">ROOM ID: {roomID} </h1>
                        <CameraLuminosityCheck videoRef={videoRef} />
                        <h1 className="footer-disclamer">Esta reunión está encriptada en la nube.</h1>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonCamera;
