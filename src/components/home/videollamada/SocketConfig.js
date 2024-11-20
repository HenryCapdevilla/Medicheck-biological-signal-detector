// socketConfig.js
import io from "socket.io-client";

const socket = io('https://medicheck.website', {
  path: '/signal', // Configura el prefijo si estás utilizando "/signal"
  transports: ['websocket'], // Fuerza el uso de WebSocket
  withCredentials: true,     // Permite el envío de cookies/sesiones
});
  
// Configura el listener para el evento 'newUserJoined' aquí
socket.on("newUserJoined", (data) => {
  const { newUserID, newUsername } = data;
  console.log(`Nuevo usuario ${newUsername} se unió con ID: ${newUserID}`);
  // Aquí podrías actualizar el estado global si lo necesitas
});

export default socket;
