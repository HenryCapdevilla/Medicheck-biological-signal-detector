import { useEffect, useState } from 'react';

export const useWebSocket = (isSignalActive, handleOffer, peerConnection) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (isSignalActive) {
            const ws = new WebSocket('ws://localhost:8080');
            setSocket(ws);

            ws.onopen = () => {
                console.log('Conectado al servidor de señalización');
            };

            ws.onmessage = async (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'offer') {
                    await handleOffer(data.offer);
                } else if (data.type === 'answer') {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                } else if (data.type === 'candidate') {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
            };

            ws.onclose = () => {
                console.log('Desconectado del servidor de señalización');
            };

            return () => {
                ws.close();
            };
        }
    }, [isSignalActive, handleOffer, peerConnection]);

    return { socket };
};
