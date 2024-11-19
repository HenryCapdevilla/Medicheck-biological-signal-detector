// videoCallHelper.js
import Peer from 'simple-peer';
import socket from './SocketConfig'; // Asegúrate de que la ruta sea correcta

export const callUser  = (id, stream, userVideo, connectionRef, me, name, setCallAccepted) => {
  console.log("Stream", stream); // Verifica si stream es un MediaStream
  if (stream && stream.getTracks) {
    console.log("stream es un MediaStream válido");
  } else {
    console.log("stream no es un MediaStream válido");
  }

  const peer = new Peer({
    initiator: true, // Define que este usuario inicia la conexión
    trickle: false, // Desactiva la transmisión de señalización en modo "trickle"
    stream: stream, // Incluye el stream de video local
  });
  console.log("peer", peer);

  // Evento 'signal' para enviar datos de señalización al usuario remoto
  peer.on("signal", (data) => {
    socket.emit("callUser ", {
      // Emite un evento al servidor con los datos de la llamada
      userToCall: id,
      signalData: data,
      from: me,
      name: name,
    });
  });

  // Evento 'stream' para recibir el stream de video del usuario remoto
  peer.on("stream", (remoteStream) => {
    userVideo.current.srcObject = remoteStream; // Asigna el stream remoto a la referencia de video
  });

  // Evento para aceptar la llamada desde el servidor
  socket.on("callAccepted", (signal) => {
    setCallAccepted(true); // Cambia el estado a llamada aceptada
    peer.signal(signal); // Completa la conexión de señalización con la señal remota
  });

  connectionRef.current = peer; // Almacena la referencia de la conexión
};