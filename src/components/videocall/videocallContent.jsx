import React, { useContext, useEffect, useState } from 'react';
import { VideoContext } from '../../context/videoProvider';
import CameraToggleButton from '../livingRoom/cameraToggleButton';
import MicrophoneToggleButton from '../livingRoom/microphoneToggleButton';
import SignalToggleButton from './signalToggleButton';
import VideoStream from './videoStreamUsers'; 
import './videocallContent.css';

import { FaHeartbeat, FaLungs } from 'react-icons/fa';  
import RecordVideoToggleButton from './recordVideoUser';

function VideocallContent() {
    const { isCameraActive, isMicActive, toggleCamera, toggleMicrophone, videoRef, startStream, stopStream } = useContext(VideoContext);
    
    const [isSignalActive, setIsSignalActive] = useState(false);
    const [heartRate, setHeartRate] = useState(null); // Estado para la frecuencia cardíaca

    useEffect(() => {
        if (isCameraActive || isMicActive) {
            startStream(isCameraActive, isMicActive);
        } else {
            stopStream();
        }

        return () => stopStream();
    }, [isCameraActive, isMicActive, startStream, stopStream]);

    // Función que actualiza el estado cuando se activa/desactiva SignalToggleButton
    const toggleSignal = (isActive) => {
        setIsSignalActive(isActive);
    };

    // Función para formatear el valor de heart_rate
    const formatHeartRate = (rate) => {
        return Math.round(rate); // Redondea el valor al entero más cercano
    };

    // Suponiendo que tienes una función para recibir el valor de heart_rate
    const handleHeartRateUpdate = (newHeartRate) => {
        setHeartRate(formatHeartRate(newHeartRate)); // Formatear y establecer la nueva frecuencia cardíaca
    };

    return (
        <div className={'VideoCall-wrapper'}>
                <div className={`VideoCall-content ${isSignalActive ? 'signal-active' : ''}`}>
                    <VideoStream 
                        isCameraActive={isCameraActive} 
                        videoRef={videoRef} 
                        message="La cámara está desactivada" 
                        isSignalActive={isSignalActive}
                        />
                    <div className={`RemoteUser VideoCall-content ${isSignalActive ? 'signal-active' : ''}`}>
                    </div>
                    <div className={`display-buttons ${isSignalActive ? 'signal-active' : ''}`}>
                        <CameraToggleButton isCameraActive={isCameraActive} toggleCamera={toggleCamera} />
                        <MicrophoneToggleButton isMicActive={isMicActive} toggleMicrophone={toggleMicrophone} />
                        <RecordVideoToggleButton onHeartRateUpdate={handleHeartRateUpdate} /> {/* Pasar la función para actualizar la frecuencia cardíaca */}
                        <SignalToggleButton toggleSignal={toggleSignal} />
                    </div>
                </div>

                {isSignalActive && ( // Mostrar solo si isSignalActive y heartRate están disponibles
                    <div className='Signal-data'>
                        <div className="measurements">
                            <p><FaHeartbeat className="icon-heart" /> Frecuencia cardíaca: {heartRate} bpm</p>
                            <p><FaLungs className="icon-lungs" /> Oxígeno en sangre: 98%</p>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default VideocallContent
