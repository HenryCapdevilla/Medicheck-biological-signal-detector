//import { useEffect, useRef, useState, useContext } from 'react';
//import Peer from 'simple-peer';
//import io from 'socket.io-client';
//import { VideoContext } from '../../context/videoProvider';  // Importar VideoContext
///
//function useSocketAndRTC(roomID, user) {
//    const { isCameraActive, isMicActive, videoRef, toggleCamera, toggleMicrophone } = useContext(VideoContext);  // Obtener el stream desde el contexto
//    const [callAccepted, setCallAccepted] = useState(false);
//    const [receivingCall, setReceivingCall] = useState(false);
//    const [caller, setCaller] = useState('');
//    const [callerSignal, setCallerSignal] = useState(null);
//    const connectionRef = useRef();
//    const [stream, setStream] = useState(null);
//
//    // Definir referencias para los elementos de video
//    const localStreamRef = useRef(null);
//    const remoteStreamRef = useRef(null);
//
//    // Actualizar el stream local si cambia el estado de la cámara o micrófono
//    useEffect(() => {
//        const getStream = async () => {
//            if (isCameraActive && isMicActive) {
//                const userStream = await navigator.mediaDevices.getUserMedia({
//                    video: true,
//                    audio: true,
//                });
//                setStream(userStream);
//                localStreamRef.current.srcObject = userStream;
//            } else if (isCameraActive) {
//                const userStream = await navigator.mediaDevices.getUserMedia({
//                    video: true,
//                    audio: false,
//                });
//                setStream(userStream);
//                localStreamRef.current.srcObject = userStream;
//            } else if (isMicActive) {
//                const userStream = await navigator.mediaDevices.getUserMedia({
//                    video: false,
//                    audio: true,
//                });
//                setStream(userStream);
//                localStreamRef.current.srcObject = userStream;
//            } else {
//                setStream(null);
//            }
//        };
//
//        getStream();
//
//        return () => {
//            if (stream) {
//                stream.getTracks().forEach(track => track.stop());
//            }
//        };
//    }, [isCameraActive, isMicActive, stream]);
//
//    useEffect(() => {
//        // Unirse a la sala de videollamada
//        socket.emit('joinRoom', roomID);
//
//        // Crear una conexión Peer para realizar la llamada
//        const createPeer = (userToCall, from, stream) => {
//            const peer = new Peer({
//                initiator: true,
//                trickle: false,
//                stream: stream,
//            });
//
//            peer.on('signal', (data) => {
//                socket.emit('callUser', { userToCall, signalData: data, from, name: user.name });
//            });
//
//            peer.on('stream', (remoteStream) => {
//                // Asignar el stream remoto a la referencia de video remoto
//                remoteStreamRef.current.srcObject = remoteStream;
//            });
//
//            return peer;
//        };
//
//        // Responder la llamada entrante
//        const answerCall = (stream) => {
//            setCallAccepted(true);
//            const peer = new Peer({
//                initiator: false,
//                trickle: false,
//                stream: stream,
//            });
//
//            peer.on('signal', (data) => {
//                socket.emit('answerCall', { signal: data, to: caller });
//            });
//
//            peer.on('stream', (remoteStream) => {
//                // Asignar el stream remoto a la referencia de video remoto
//                remoteStreamRef.current.srcObject = remoteStream;
//            });
//
//            peer.signal(callerSignal);
//            connectionRef.current = peer;
//        };
//
//        // Manejar evento cuando un nuevo usuario se une a la sala
//        socket.on('userJoined', (userID) => {
//            const peer = createPeer(userID, socket.id, stream);
//            connectionRef.current = peer;
//        });
//
//        // Manejar evento de llamada entrante
//        socket.on('callUser', (data) => {
//            setReceivingCall(true);
//            setCaller(data.from);
//            setCallerSignal(data.signal);
//        });
//
//        // Aceptar la llamada automáticamente si estamos recibiendo una
//        if (receivingCall && !callAccepted) {
//            answerCall(stream);
//        }
//
//        // Cleanup: eliminar listeners y destruir la conexión al desmontar
//        return () => {
//            socket.off('userJoined');
//            socket.off('callUser');
//            if (connectionRef.current) {
//                connectionRef.current.destroy();
//            }
//        };
//
//    }, [callAccepted, receivingCall, roomID, stream, caller, callerSignal, user.name]);
//
//    // Finalizar la llamada
//    function leaveCall() {
//        setCallAccepted(false);
//        connectionRef.current?.destroy();
//        socket.emit('disconnect');
//    }
//
//    return { localStreamRef, remoteStreamRef, callAccepted, receivingCall, leaveCall, toggleCamera, toggleMicrophone };
//}
//
//export default useSocketAndRTC;
//