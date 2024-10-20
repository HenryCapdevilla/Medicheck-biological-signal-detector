import React, { useState, useRef } from 'react';
import { FaStop } from 'react-icons/fa'; // Para los iconos de grabación y detener
import './recordVideoUser.css';

const VideoRecordButton = ({ onHeartRateUpdate }) => { // Recibe la función como prop
    const [isRecording, setIsRecording] = useState(false); // Estado de grabación
    const mediaRecorderRef = useRef(null); // Referencia para MediaRecorder
    const recordedChunks = useRef([]); // Fragmentos del video grabado

    // Función para mostrar el pop-up de confirmación
    const showConfirmationPopup = () => {
        return new Promise((resolve) => {
            const confirmRecording = window.confirm("Se realizará una grabación de video de 8 segundos. ¿Desea continuar?");
            resolve(confirmRecording);
        });
    };

    // Función para iniciar la grabación de video de 8 segundos
    const handleRecord = async () => {
        const confirmRecording = await showConfirmationPopup();
        
        if (!confirmRecording) {
            return; // Si el médico cancela, no hace nada
        }

        recordedChunks.current = []; // Resetear fragmentos grabados

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.current.push(event.data); // Almacena fragmentos del video
                }
            };

            mediaRecorderRef.current.start(); // Inicia la grabación
            setIsRecording(true); // Cambia el estado a "grabando"

            // Detener la grabación automáticamente después de 8 segundos
            setTimeout(() => {
                mediaRecorderRef.current.stop();
                stream.getTracks().forEach(track => track.stop()); // Detiene la cámara
            }, 8000); // 8 segundos

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                const videoFile = new File([blob], 'recorded-video.webm', { type: 'video/webm' });

                // Enviar el archivo al servidor Flask
                const formData = new FormData();
                formData.append('video', videoFile, videoFile.name);

                fetch('http://localhost:5000/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.heart_rate) {
                        console.log('Video subido y procesado:', data.heart_rate);
                        onHeartRateUpdate(data.heart_rate); // Llama a la función para actualizar el heartRate
                    } else {
                        console.error('Error al procesar el video');
                        console.error(data);
                    }
                })
                .catch(error => {
                    console.error('Error en la subida del video:', error);
                });

                // Regresa el estado a "no grabando" después de detenerse
                setIsRecording(false);
            };
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
        }
    };

    return (
        <button onClick={handleRecord} disabled={isRecording} className='Button-videocall-record'>
            {/* Cambiar el ícono según el estado de grabación */}
            {isRecording ? (
                <FaStop size={20} color="red"/>
            ) : (
                <FaStop size={20} color="white"/>
            )}
        </button>
    );
};

export default VideoRecordButton;
