import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoContext } from '../../context/videoProvider';
import CameraToggleButton from './cameraToggleButton';
import MicrophoneToggleButton from './microphoneToggleButton';
import './userCamaraContainer.css';

const ButtonCamera = () => {
    const { roomID } = useParams(); 
    const navigate = useNavigate(); 
    const { isCameraActive, isMicActive, toggleCamera, toggleMicrophone, videoRef, startStream, stopStream } = useContext(VideoContext);

    useEffect(() => {
        if (isCameraActive || isMicActive) {
            startStream(isCameraActive, isMicActive);
        } else {
            stopStream();
        }

        return () => stopStream();
    }, [isCameraActive, isMicActive, startStream, stopStream]);

    const joinCall = () => {
        navigate(`/videocall/${roomID}`);
    };

    return (
        <div className="User-Content">
            <div className='body-livingroom'>
                <div className='video-container'>
                    {!isCameraActive && <h1 className="camera-off-text">La cámara está desactivada</h1>}
                    <video ref={videoRef} className="video-self" autoPlay muted playsInline></video>
                    <div className="Display-buttons">
                        <div className='Background-Display-Buttons'>
                            <CameraToggleButton
                                isCameraActive={isCameraActive}
                                toggleCamera={toggleCamera}
                            />
                            <MicrophoneToggleButton
                                isMicActive={isMicActive}
                                toggleMicrophone={toggleMicrophone}
                            />
                        </div>
                    </div>
                </div>
                <div className='user-input-videocall'>
                    <h1 className="text-general">Ya puedes ingresar a la reunión</h1>
                    <button onClick={joinCall} className="join-call-button">Unirse a la Videollamada</button>
                    <h1 className="text-general">ROOM ID: {roomID} </h1>
                </div>
            </div>
            <h1 className="footer-disclamer">Esta reunión está encriptada en la nube.</h1>
        </div>
    );
};

export default ButtonCamera;
