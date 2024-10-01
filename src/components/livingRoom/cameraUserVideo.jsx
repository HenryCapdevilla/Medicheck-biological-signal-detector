import React, { useEffect, useRef } from 'react';


const CameraUserVideo = ({ isCameraActive }) => {
    const videoRef = useRef(null); // Referencia al elemento <video>

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error al acceder a la cámara: ', error);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            let stream = videoRef.current.srcObject;
            let tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // Efecto para iniciar o detener la cámara según el prop
    useEffect(() => {
        if (isCameraActive) {
            startCamera();
        } else {
            stopCamera();
        }

        // Cleanup: Detén el stream de la cámara cuando el componente se desmonte
        return () => stopCamera();
    }, [isCameraActive]);

    return <video ref={videoRef} className="video-self" autoPlay muted playsInline></video>;
};

export default CameraUserVideo;
