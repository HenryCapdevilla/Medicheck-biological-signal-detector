import React, { createContext, useState, useRef } from 'react';

// Crear el contexto
export const VideoContext = createContext();

// Proveedor de contexto para la cámara y micrófono
export const VideoProvider = ({ children }) => {
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
        setIsCameraActive(prev => {
            const newState = !prev;
            if (newState) {
                startStream(true, isMicActive); // Iniciar la cámara
            } else {
                stopStream(); // Detener el stream si la cámara se apaga
            }
            return newState;
        });
    };

    const toggleMicrophone = () => {
        setIsMicActive(prev => {
            const newState = !prev; // Invierte el estado actual del micrófono (encendido/apagado)
    
            if (videoRef.current && videoRef.current.srcObject) {
                const audioTracks = videoRef.current.srcObject.getAudioTracks(); // Obtiene las pistas de audio
    
                // Si el micrófono está encendido, activamos las pistas de audio
                if (newState) {
                    audioTracks.forEach(track => track.enabled = true);
                } else {
                    // Si el micrófono está apagado, desactivamos las pistas de audio (sin detener el stream de video)
                    audioTracks.forEach(track => track.enabled = false);
                }
            }
    
            return newState; // Retorna el nuevo estado para actualizar `isMicActive`
        });
    };
    

    return (
        <VideoContext.Provider value={{
            isCameraActive,
            isMicActive,
            toggleCamera,
            toggleMicrophone,
            videoRef,
            startStream,
            stopStream
        }}>
            {children}
        </VideoContext.Provider>
    );
};
