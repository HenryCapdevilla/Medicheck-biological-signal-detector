import io from "socket.io-client";

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
  return socket; // Asegúrate de devolver el socket inicializado
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket no inicializado. Llama a initializeSocket primero.");
  }
  return socket;
};

export default initializeSocket;
