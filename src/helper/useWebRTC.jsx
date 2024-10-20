import { useEffect, useRef, useState } from 'react';

export const useWebRTC = (roomId, socket) => {
    const [inCall, setInCall] = useState(false);
    const [peerConnection, setPeerConnection] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        socket.onopen = () => {
          socket.send(JSON.stringify({ type: 'joinRoom', roomId }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'readyForCall':
                    initializeWebRTC();  // Iniciar la videollamada cuando ambos usuarios están listos
                    break;
                case 'offer':
                    handleOffer(data.offer);
                    break;
                case 'answer':
                    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                    break;
                case 'candidate':
                    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                    break;
                default:
                    break;
                }
        };

    const initializeWebRTC = async () => {
        const newPeerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        newPeerConnection.ontrack = (event) => {
            videoRef.current.srcObject = event.streams[0];
        };

        newPeerConnection.onicecandidate = (event) => {
            if (event.candidate) {
            socket.send(JSON.stringify({
                type: 'candidate',
                candidate: event.candidate,
                roomId
            }));
            }
        };

        setPeerConnection(newPeerConnection);
    };

    const handleOffer = async (offer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.send(JSON.stringify({
            type: 'answer',
            answer,
            roomId
        }));
    };

}, [socket, roomId, peerConnection]);

    const enterCall = () => {
        socket.send(JSON.stringify({ type: 'enterCall', roomId }));
        setInCall(true);
    };

return { videoRef, enterCall, inCall };
};
