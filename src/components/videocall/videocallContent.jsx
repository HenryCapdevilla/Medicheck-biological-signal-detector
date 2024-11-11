import React, { useContext, useEffect, useState} from 'react';
import { VideoContext } from '../../context/videoProvider';
import CameraToggleButton from '../livingRoom/cameraToggleButton';
import MicrophoneToggleButton from '../livingRoom/microphoneToggleButton';
import SignalToggleButton from './signalToggleButton';
import VideoStream from './videoStreamUsers'; 
import './videocallContent.css';
import { FaHeartbeat, FaLungs } from 'react-icons/fa';  
import RecordVideoToggleButton from './recordVideoUser';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import HangUpButton from './hangupToggleButton';
import ClinicalHistoryButton from './clinicalHistoryButton';
import { useAuth } from '../../context/AuthContext';

function VideocallContent() {
    const { isCameraActive, isMicActive, toggleCamera, toggleMicrophone, videoRef, startStream, stopStream } = useContext(VideoContext);
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isSignalActive, setIsSignalActive] = useState(false);
    const [heartRate, setHeartRate] = useState(null);
    const [sp02, setSp02] = useState(null);
    const { roomID } = useParams(); // Obtenemos roomID de la URL
    
    useEffect(() => {
        const newSocket = io('http://localhost:8080'); // Usa http si no tienes SSL en tu servidor
        setSocket(newSocket);
    
        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            newSocket.emit('join-room', roomID); // Únete a la sala
        });
    
        newSocket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });
    
        return () => {
            newSocket.disconnect();
        };
    }, [roomID]);

    useEffect(() => {
        if (isCameraActive || isMicActive) {
            startStream(isCameraActive, isMicActive);
        } else {
            stopStream();
        }

        return () => stopStream();
    }, [isCameraActive, isMicActive, startStream, stopStream]);

    const toggleSignal = (isActive) => {
        setIsSignalActive(isActive);
    };

    const formatHeartRate = (rate) => {
        return Math.round(rate);
    };

    const handleHeartRateUpdate = (newHeartRate) => {
        setHeartRate(formatHeartRate(newHeartRate));
    };

    const handleSpo2Update = (newSp02) => {
        setSp02(formatHeartRate(newSp02));
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
                    
                    {/* Mostrar estos botones solo si el rol es 'medico' o 'admin' */}
                    {['medico', 'admin'].includes(user.role) && (
                        <>
                            <RecordVideoToggleButton onHeartRateUpdate={handleHeartRateUpdate} onSpo2RateUpdate={handleSpo2Update} />
                            <SignalToggleButton toggleSignal={toggleSignal} />
                            <ClinicalHistoryButton />
                        </>
                    )}
                    
                    <HangUpButton socket={socket} roomID={roomID} />
                </div>
            </div>

            {isSignalActive && (
                <div className='Signal-data'>
                    <div className="measurements">
                        <div className='one-column'>
                            <p> Frecuencia cardíaca </p>
                            <p> <FaHeartbeat className="icon-heart" />{heartRate} bpm</p>
                        </div>
                        <div className='one-column'>
                            <p> Oxígeno en sangre </p>
                            <p> <FaLungs className="icon-lungs" /> {sp02} % </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideocallContent;
