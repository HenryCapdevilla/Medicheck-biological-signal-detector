import React, { useState, useRef } from 'react';
import { FaStop } from 'react-icons/fa';
import './recordVideoUser.css';

const VideoRecordButton = React.forwardRef(({ onHeartRateUpdate, onSpo2RateUpdate, userVideoRef, ...props }, ref) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);

    const showConfirmationPopup = () => {
        return new Promise((resolve) => {
            const confirmRecording = window.confirm("Se realizará una grabación de video de 8 segundos. ¿Desea continuar?");
            resolve(confirmRecording);
        });
    };

    const handleRecord = async () => {
        const confirmRecording = await showConfirmationPopup();
        if (!confirmRecording) return;

        recordedChunks.current = [];

        try {
            // Usa el stream del video referenciado por `userVideoRef`
            const stream = userVideoRef.current.srcObject;

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.current.push(event.data);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            setTimeout(() => {
                mediaRecorderRef.current.stop();
            }, 8000);

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                const videoFile = new File([blob], 'recorded-video.webm', { type: 'video/webm' });

                const formData = new FormData();
                formData.append('video', videoFile, videoFile.name);

                fetch('https://medicheck.website/api/python', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.heart_rate) onHeartRateUpdate(data.heart_rate);
                    if (data.spo2_rate) onSpo2RateUpdate(data.spo2_rate);
                })
                .catch(error => {
                    console.error('Error en la subida del video:', error);
                });
                
                setIsRecording(false);
            };
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
        }
    };

    return (
        <button 
            onClick={handleRecord} 
            disabled={isRecording} 
            className="Button-videocall-record" 
            ref={ref} 
            {...props}
        >
            {isRecording ? (
                <FaStop size={20} color="red"/>
            ) : (
                <FaStop size={20} color="white"/>
            )}
        </button>
    );
});

export default VideoRecordButton;
