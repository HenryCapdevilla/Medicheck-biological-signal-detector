// socketConfig.js
import io from "socket.io-client";

// No establecemos la conexión aquí
let socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('https://medicheck.website/signal', {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('Conexión WebSocket establecida');
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
    });
  }
};

export const getSocket = () => socket;

export default socket;
