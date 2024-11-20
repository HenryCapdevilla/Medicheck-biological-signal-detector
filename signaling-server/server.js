const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    path: '/signal',
    cors: {
        origin: "*",  // Permite cualquier origen
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,  // Mantiene la opción para las credenciales (cookies, autenticación)
    }
});

let rooms = {}; // Almacena los RoomID y los usuarios asociados a cada uno

// Función para verificar si dos usuarios están en la misma sala
function areUsersInSameRoom(userID1, userID2, rooms) {
    for (const roomID in rooms) {
        const usersInRoom = Object.values(rooms[roomID]);
        if (usersInRoom.includes(userID1) && usersInRoom.includes(userID2)) {
            return roomID; // Devuelve el RoomID si ambos usuarios están en la misma sala
        }
    }
    return null; // Si no están en la misma sala
}

io.on("connection", (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Registrar un usuario en una sala
    socket.on("registerUser", (data) => {
        const { Username, RoomID } = data;

        // Si la sala no existe, se crea
        if (!rooms[RoomID]) {
            rooms[RoomID] = {};
        }

        // Si el usuario ya está en la sala, no lo volvemos a agregar
        if (rooms[RoomID][Username]) {
            console.log(`El usuario ${Username} ya está en la sala ${RoomID}.`);
            socket.emit("me", rooms[RoomID][Username]);
        } else {
            console.log(`Usuario ${Username} registrado en la sala ${RoomID}.`);
            rooms[RoomID][Username] = socket.id; // Asocia el usuario con el socket ID en la sala
            socket.join(RoomID); // Une el socket al RoomID
            socket.emit("me", socket.id); // Envía el socket ID al cliente
        }

        console.log("Estado actual de rooms:", JSON.stringify(rooms, null, 2));
    });

    // Desconectar al usuario
    socket.on("disconnect", () => {
        for (const [RoomID, users] of Object.entries(rooms)) {
            for (const [Username, id] of Object.entries(users)) {
                if (id === socket.id) {
                    delete rooms[RoomID][Username];
                    console.log(`Usuario ${Username} desconectado de la sala ${RoomID}.`);

                    // Si la sala queda vacía, se elimina
                    if (Object.keys(rooms[RoomID]).length === 0) {
                        delete rooms[RoomID];
                    }
                    break;
                }
            }
        }
        console.log("Estado actual de rooms:", JSON.stringify(rooms, null, 2));
    });

    socket.on("callUser", (data) => {
        const { userToCall, from } = data;
        
        console.log("Usuario que llama:", userToCall);
        console.log("Usuario que recibe:", from);
    
        const roomID = areUsersInSameRoom(userToCall, from, rooms);
    
        if (roomID) {
            console.log(`Llamada iniciada de ${from} a ${userToCall} en la sala ${roomID}`);
            
            // Envía el mensaje de señalización de la llamada al usuario receptor
            io.to(rooms[roomID][userToCall]).emit("callUser", {
                signal: data.signalData,
                from: data.from,
                name: data.name
            });
            
            // Ahora el receptor puede enviar sus candidatos ICE al que llamó
        } else {
            console.log(`Llamada no permitida: ${from} y ${userToCall} no están en la misma sala.`);
        }
    });
    

    // Registrar evento 'answerCall'
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    // Manejo de ICE Candidates
    socket.on("iceCandidate", (data) => {
        console.log("Enviando candidato ICE:", data);
        // Enviar el candidato ICE al usuario correspondiente
        io.to(data.to).emit("newIceCandidate", data.candidate);
    });

    // Evento para colgar la llamada
    socket.on("hang-up", (roomID) => {
        console.log(`El usuario ${socket.id} colgó la llamada en la sala ${roomID}.`);
        
        // Notificar a todos los demás usuarios en la sala que la llamada ha finalizado
        socket.to(roomID).emit("callEnded");

        // Verificar si la sala y el usuario existen
        if (rooms[roomID]) {
            // Buscar el Username correspondiente al socket.id en la sala
            const username = Object.keys(rooms[roomID]).find(
                (user) => rooms[roomID][user] === socket.id
            );

            if (username) {
                // Eliminar al usuario de la sala
                delete rooms[roomID][username];
                socket.leave(roomID);

                // Si la sala queda vacía, eliminarla del objeto rooms
                if (Object.keys(rooms[roomID]).length === 0) {
                    delete rooms[roomID];
                }
            }
        }

        console.log("Estado actual de rooms después de colgar:", JSON.stringify(rooms, null, 2));
    });
});

server.listen(8080, () => {
    console.log(`Servidor escuchando en el puerto 8080`);
});
