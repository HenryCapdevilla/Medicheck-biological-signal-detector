import React, { useContext, useEffect, useState} from 'react';
import { VideoContext } from '../../context/videoProvider';
import CameraToggleButton from '../livingRoom/cameraToggleButton';
import MicrophoneToggleButton from '../livingRoom/microphoneToggleButton';
import SignalToggleButton from './signalToggleButton';
import VideoStream from './videoStreamUsers'; 
import './videocallContent.css';
import { FaHeartbeat, FaLungs } from 'react-icons/fa';  
import RecordVideoToggleButton from './recordVideoUser';
import useWebRTC from '../../helper/useWebRTC';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import HangUpButton from './hangupToggleButton';
import ClinicalHistoryButton from './clinicalHistoryButton';

function VideocallContent() {
    const { isCameraActive, isMicActive, toggleCamera, toggleMicrophone, videoRef, startStream, stopStream } = useContext(VideoContext);
    
    const [socket, setSocket] = useState(null);
    const [isSignalActive, setIsSignalActive] = useState(false);
    const [heartRate, setHeartRate] = useState(null);
    const [sp02, setSp02] = useState(null);
    const { roomID } = useParams(); // Obtenemos roomID de la URL
    const { remoteVideoRefs } = useWebRTC(socket, roomID, videoRef); // Modifica el hook para aceptar el socket y roomID
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
                    {Object.keys(remoteVideoRefs).map(userId => (
                        <VideoStream 
                            key={userId}
                            isCameraActive={true} 
                            videoRef={remoteVideoRefs[userId]} 
                            message="Esperando conexión remota..." 
                            isSignalActive={isSignalActive}
                        />
                    ))}
                </div>
                <div className={`display-buttons ${isSignalActive ? 'signal-active' : ''}`}>
                    <CameraToggleButton isCameraActive={isCameraActive} toggleCamera={toggleCamera} />
                    <MicrophoneToggleButton isMicActive={isMicActive} toggleMicrophone={toggleMicrophone} />
                    <RecordVideoToggleButton onHeartRateUpdate={handleHeartRateUpdate} onSpo2RateUpdate={handleSpo2Update} />
                    <SignalToggleButton toggleSignal={toggleSignal} />
                    <HangUpButton socket={socket} roomID={roomID} />
                    <ClinicalHistoryButton />
                </div>
            </div>

            {isSignalActive && (
                <div className='Signal-data'>
                    <div className="measurements">
                        <p><FaHeartbeat className="icon-heart" /> Frecuencia cardíaca: {heartRate} bpm</p>
                        <p><FaLungs className="icon-lungs" /> Oxígeno en sangre: {sp02} %</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VideocallContent;
