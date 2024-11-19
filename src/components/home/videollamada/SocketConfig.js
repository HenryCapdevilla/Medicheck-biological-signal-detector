// socketConfig.js
import io from "socket.io-client";

const socket = io('https://medicheck.website/signal', {
    withCredentials: true,
    transports: ['websocket'], // Forzar WebSocket como transporte
});

// Configura el listener para el evento 'newUserJoined' aquí
socket.on("newUserJoined", (data) => {
  const { newUserID, newUsername } = data;
  console.log(`Nuevo usuario ${newUsername} se unió con ID: ${newUserID}`);
  // Aquí podrías actualizar el estado global si lo necesitas
});

socket.on('connect', () => {
  console.log('Conexión WebSocket establecida');
});

socket.on('connect_error', (error) => {
  console.error('Error de conexión WebSocket:', error);
});

export default socket;
