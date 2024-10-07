import React, { useState, useEffect, useRef } from 'react';
import CameraToggleButton from './cameraToggleButton';
import MicrophoneToggleButton from './microphoneToggleButton';
import './userCamaraContainer.css';
import JoinToggleButton from './joinToggleButton';

const ButtonCamera = () => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);
    const videoRef = useRef(null);

    const startStream = async (camAllowed, micAllowed) => {
        try {
            const mediaConstraints = {
                video: camAllowed ? true : false,
                audio: micAllowed ? true : false
            };
            const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error al acceder a la cámara o el micrófono:', error);
        }
    };

    const stopStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            let stream = videoRef.current.srcObject;
            let tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const toggleCamera = () => {
        setIsCameraActive(!isCameraActive);
    };

    const toggleMicrophone = () => {
        setIsMicActive(!isMicActive);
    };

    useEffect(() => {
        if (isCameraActive || isMicActive) {
            startStream(isCameraActive, isMicActive);
        } else {
            stopStream();
        }

        // Cleanup: Detén el stream cuando el componente se desmonte
        return () => stopStream();
    }, [isCameraActive, isMicActive]);

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
                        <JoinToggleButton></JoinToggleButton>
                </div>
            </div>
                <h1 className="footer-disclamer">Esta reunión está encriptada en la nube.</h1>
        </div>
    );
};

export default ButtonCamera;
