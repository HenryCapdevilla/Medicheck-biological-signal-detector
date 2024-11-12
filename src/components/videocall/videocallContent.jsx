import React, { useState, useEffect } from 'react';
import CameraToggleButton from '../livingRoom/cameraToggleButton';
import MicrophoneToggleButton from '../livingRoom/microphoneToggleButton';
import SignalToggleButton from './signalToggleButton';
import VideoStream from './videoStreamUsers';
import './videocallContent.css';
import { FaHeartbeat, FaLungs } from 'react-icons/fa';
import RecordVideoToggleButton from './recordVideoUser';
import { useParams } from 'react-router-dom';
import HangUpButton from './hangupToggleButton';
import ClinicalHistoryButton from './clinicalHistoryButton';
import { useAuth } from '../../context/AuthContext';
import useSocketAndRTC from './useSocketAndRTC';

function VideocallContent() {
    const { user } = useAuth();
    const { roomID } = useParams();
    const [isSignalActive, setIsSignalActive] = useState(false);
    const [heartRate, setHeartRate] = useState(null);
    const [sp02, setSp02] = useState(null);

    // Llamamos a useSocketAndRTC sin condicionales
    const { toggleCamera, 
            isMicActive, 
            isCameraActive,
            toggleMicrophone, 
            localStreamRef, 
            remoteStreamRef, 
            callAccepted, 
            leaveCall } = useSocketAndRTC(roomID, user);

    const toggleSignal = (isActive) => {
        setIsSignalActive(isActive);
    };

    const formatHeartRate = (rate) => Math.round(rate);

    const handleHeartRateUpdate = (newHeartRate) => {
        setHeartRate(formatHeartRate(newHeartRate));
    };

    const handleSpo2Update = (newSp02) => {
        setSp02(formatHeartRate(newSp02));
    };

    if (!roomID) {
        return <div>Loading...</div>;  // Mostrar un mensaje de carga mientras no hay roomID
    }

    return (
        <div className="VideoCall-wrapper">
            <div className={`VideoCall-content ${isSignalActive ? 'signal-active' : ''}`}>
                <VideoStream
                    isCameraActive={isCameraActive}
                    videoRef={localStreamRef}
                    message="La cámara está desactivada"
                    isSignalActive={isSignalActive}
                />
                {callAccepted && (
                    <VideoStream
                        isCameraActive={isCameraActive}
                        videoRef={remoteStreamRef}
                        message="El usuario remoto no tiene la cámara activa"
                        isSignalActive={isSignalActive}
                    />
                )}
                <div className={`display-buttons ${isSignalActive ? 'signal-active' : ''}`}>
                    <CameraToggleButton isCameraActive={isCameraActive} toggleCamera={toggleCamera} />
                    <MicrophoneToggleButton isMicActive={isMicActive} toggleMicrophone={toggleMicrophone} />
                    
                    {['medico', 'admin'].includes(user.role) && (
                        <>
                            <RecordVideoToggleButton onHeartRateUpdate={handleHeartRateUpdate} onSpo2RateUpdate={handleSpo2Update} />
                            <SignalToggleButton toggleSignal={toggleSignal} />
                            <ClinicalHistoryButton />
                        </>
                    )}
                    
                    <HangUpButton onClick={leaveCall} />
                </div>
            </div>

            {isSignalActive && (
                <div className='Signal-data'>
                    <div className="measurements">
                        <div className='one-column'>
                            <p>Frecuencia cardíaca</p>
                            <p><FaHeartbeat className="icon-heart" /> {heartRate} bpm</p>
                        </div>
                        <div className='one-column'>
                            <p>Oxígeno en sangre</p>
                            <p><FaLungs className="icon-lungs" /> {sp02} %</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideocallContent;
