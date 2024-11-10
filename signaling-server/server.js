const express = require('express');
const http = require('http'); // Cambia https por http si no tienes SSL configurado
const { Server } = require('socket.io');
const cors = require('cors');
const moment = require('moment');

const app = express();
const server = http.createServer(app); // Si no tienes un certificado SSL, usa http

// Configurar CORS en Express
app.use(cors({
    origin: 'http://localhost:3000', // Cambia esto al origen de tu cliente
    methods: ['GET', 'POST'],
    credentials: true
}));


let rooms = {};
let socketroom = {};
let micSocket = {};
let videoSocket = {};

// Configurar CORS en Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Cambia esto al origen de tu cliente
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('join-room', (roomID) => {
        socketroom[socket.id] = roomID;
        micSocket[socket.id] = 'on';
        videoSocket[socket.id] = 'on';
        socket.join(roomID);
        
        // Asegúrate de inicializar la sala si no existe
        if (!rooms[roomID]) {
            rooms[roomID] = []; // Inicializa el array para la sala
        }
    
        console.log(`Usuario ${socket.id} se unió a la sala: ${roomID}`);
        console.log(rooms[roomID]);
        console.log(rooms[roomID].length);
        
        // Agregar el socket.id a la sala
        rooms[roomID].push(socket.id);
    
        if (rooms[roomID].length > 1) { // Cambiar a > 1 para verificar si hay más usuarios
            socket.to(roomID).emit('user-connected', socket.id); // Emitir evento a los demás usuarios
            console.log(`[${moment().format("h:mm a")}] ${socket.id} joined the room.`);
            io.to(socket.id).emit('join room', rooms[roomID].filter(pid => pid !== socket.id), socket.id, micSocket, videoSocket);
        } else {
            io.to(socket.id).emit('join room', null, null, null, null); // Emitir solo al usuario si es el primero
        }
    });
    
    socket.on('offer', (offer, userId) => {
        socket.to(userId).emit('offer', offer, socket.id);
    });

    socket.on('answer', (answer, userId) => {
        socket.to(userId).emit('answer', answer, socket.id);
    });

    socket.on('ice-candidate', (candidate, userId) => {
        socket.to(userId).emit('ice-candidate', candidate, socket.id);
    });

    socket.on('disconnect', (roomID) => {
        socket.to(roomID).emit('user-disconnected', socket.id);
    });

    socket.on('hang-up', (roomID) => {
        // Remover el socket.id de la sala
        rooms[roomID] = rooms[roomID].filter(id => id !== socket.id);
        console.log(`[${moment().format("h:mm a")}] ${socket.id} leave the room.`);
        console.log("Número de usuarios conectados", rooms[roomID].length);
        // Emitir el evento de desconexión a los demás usuarios en la sala
        socket.to(roomID).emit('user-disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
