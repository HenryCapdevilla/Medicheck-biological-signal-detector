const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

let rooms = {}; // Almacena los RoomID y los usuarios asociados a cada uno

io.on("connection", (socket) => {
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
            console.log("Room1", rooms[RoomID][Username]);
        } else {
            console.log(`Usuario ${Username} registrado en la sala ${RoomID}.`);
            rooms[RoomID][Username] = socket.id; // Asocia el usuario con el socket ID en la sala
            socket.join(RoomID); // Une el socket al RoomID
            socket.emit("me", socket.id); // Envía el socket ID al cliente
            console.log("Room2",rooms[RoomID][Username]);
        }

        // Mostrar el estado actual de 'rooms' después de registrar un usuario
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

        // Mostrar el estado actual de 'rooms' después de la desconexión
        console.log("Estado actual de rooms:", JSON.stringify(rooms, null, 2));
    });

    // Registrar evento 'callUser'
    socket.on("callUser", (data) => {
        const { userToCall, from, signalData, name } = data;

        // Buscar la sala donde se encuentran ambos usuarios
        let userRoom = null;
        for (const [RoomID, users] of Object.entries(rooms)) {
            if (users[userToCall] && users[from]) {
                userRoom = RoomID;
                break;
            }
        }

        // Solo permite la llamada si ambos usuarios están en la misma sala
        if (userRoom) {
            console.log(`Llamada iniciada de ${from} a ${userToCall} en la sala ${userRoom}`);
            io.to(rooms[userRoom][userToCall]).emit("callUser", { signal: signalData, from, name });
        } else {
            console.log(`Llamada no permitida: ${from} y ${userToCall} no están en la misma sala.`);
        }

        // Mostrar el estado actual de 'rooms' después de intentar la llamada
        console.log("Estado actual de rooms:", JSON.stringify(rooms, null, 2));
    });

    // Registrar evento 'answerCall'
    socket.on("answerCall", (data) => {
        const { to, from, signal } = data;

        // Buscar la sala donde se encuentran ambos usuarios
        let userRoom = null;
        for (const [RoomID, users] of Object.entries(rooms)) {
            if (users[to] && users[from]) {
                userRoom = RoomID;
                break;
            }
        }

        // Solo permite la respuesta si ambos usuarios están en la misma sala
        if (userRoom) {
            console.log(`Usuario ${to} aceptó la llamada de ${from} en la sala ${userRoom}`);
            io.to(rooms[userRoom][to]).emit("callAccepted", signal);
        } else {
            console.log(`Respuesta no permitida: ${to} y ${from} no están en la misma sala.`);
        }

        // Mostrar el estado actual de 'rooms' después de responder la llamada
        console.log("Estado actual de rooms:", JSON.stringify(rooms, null, 2));
    });
});

server.listen(8080, () => {
    console.log(`Servidor escuchando en el puerto 8080`);
});
