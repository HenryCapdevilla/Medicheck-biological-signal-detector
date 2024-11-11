import { useEffect, useRef } from 'react';

const useWebRTC = (socket, roomID, localVideoRef) => {
    const peerConnections = useRef({});
    const configuration = { iceServers: [{ urls: "stun:stun2.1.google.com:19302" }] }

    useEffect(() => {
        if (!socket) return;

        socket.on('user-connected', (userId) => {
            const peerConnection = new RTCPeerConnection(configuration);
            peerConnections.current[userId] = peerConnection;

            // Añadir la transmisión local al nuevo peer connection
            localVideoRef.current.srcObject.getTracks().forEach(track => {
                peerConnection.addTrack(track, localVideoRef.current.srcObject);
            });

            peerConnection.ontrack = (event) => {
                const remoteVideo = document.createElement('video');
                remoteVideo.srcObject = event.streams[0];
                remoteVideo.autoplay = true;
                document.body.appendChild(remoteVideo); // O un contenedor específico para videos remotos
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', event.candidate, userId);
                }
            };

            peerConnection.onnegotiationneeded = () => {
                peerConnection.createOffer()
                    .then((offer) => peerConnection.setLocalDescription(offer))
                    .then(() => {
                        socket.emit('offer', peerConnection.localDescription, userId);
                    })
                    .catch(console.error);
            };
        });

        // Evento para manejar la oferta entrante
        socket.on('offer', (offer, userId) => {
            const peerConnection = new RTCPeerConnection(configuration);
            peerConnections.current[userId] = peerConnection;
        
            // Establecer la descripción remota con la oferta
            peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
                .then(() => {
                    // Añadir la transmisión local al peer connection
                    localVideoRef.current.srcObject.getTracks().forEach(track => {
                        peerConnection.addTrack(track, localVideoRef.current.srcObject);
                    });
                
                    // Crear la respuesta (answer) y enviarla
                    return peerConnection.createAnswer();
                })
                .then((answer) => {
                    return peerConnection.setLocalDescription(answer);  // Establecer localmente la respuesta
                })
                .then(() => {
                    // Enviar la respuesta de vuelta al peer que hizo la oferta
                    socket.emit('answer', peerConnection.localDescription, userId);
                })
                .catch(console.error);  // Manejo de errores
        });

        // Evento para manejar la respuesta entrante
        socket.on('answer', (answer, userId) => {
            const peerConnection = peerConnections.current[userId];
            if (peerConnection) {
                // Establecer la descripción remota con la respuesta
                peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                    .catch(console.error);  // Manejo de errores
            } else {
                console.error('No se encontró la conexión peer para el usuario:', userId);
            }
        });


        socket.on('ice-candidate', (candidate, userId) => {
            const peerConnection = peerConnections.current[userId];
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
                    .catch(console.error);
            }
        });

            // Manejar la desconexión de un usuario

    socket.on('user-disconnected', (userId) => {
        const peerConnection = peerConnections.current[userId];
        if (peerConnection) {
            peerConnection.close(); // Cerrar la conexión del peer
            delete peerConnections.current[userId]; // Eliminar la referencia
        }
    });
        return () => {
            Object.values(peerConnections.current).forEach(peerConnection => peerConnection.close());
        };
    }, [socket, roomID, localVideoRef]);

    return { remoteVideoRefs: peerConnections.current };
};

export default useWebRTC;
