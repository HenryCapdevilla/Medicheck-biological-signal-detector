// socketConfig.js
import io from "socket.io-client";

const socket = io('http://localhost:8080', {
    withCredentials: true,
    transports: ['websocket'],
  });
  

// Configura el listener para el evento 'newUserJoined' aquí
socket.on("newUserJoined", (data) => {
  const { newUserID, newUsername } = data;
  console.log(`Nuevo usuario ${newUsername} se unió con ID: ${newUserID}`);
  // Aquí podrías actualizar el estado global si lo necesitas
});

export default socket;
