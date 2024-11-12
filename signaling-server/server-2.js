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
        } else {
            console.log(`Usuario ${Username} registrado en la sala ${RoomID}.`);
            rooms[RoomID][Username] = socket.id; // Asocia el usuario con el socket ID en la sala
            socket.join(RoomID); // Une el socket al RoomID
            socket.emit("me", socket.id); // Envía el socket ID al cliente
        }
    });

    socket.on("disconnect", () => {
        // Encuentra y elimina al usuario de la sala correspondiente
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
    });

    // Registrar evento 'callUser'
    socket.on("callUser", (data) => {
        const { userToCall, from, RoomID, signalData, name } = data;
        console.log(`Llamada iniciada de ${from} a ${userToCall} en la sala ${RoomID}`);

        // Emitir el evento solo a usuarios dentro de la misma sala
        if (rooms[RoomID] && rooms[RoomID][userToCall]) {
            io.to(rooms[RoomID][userToCall]).emit("callUser", { signal: signalData, from, name });
        }
    });

    // Registrar evento 'answerCall'
    socket.on("answerCall", (data) => {
        const { to, from, RoomID, signal } = data;
        console.log(`Usuario ${to} aceptó la llamada de ${from} en la sala ${RoomID}`);

        // Emitir el evento solo a usuarios dentro de la misma sala
        if (rooms[RoomID] && rooms[RoomID][to]) {
            io.to(rooms[RoomID][to]).emit("callAccepted", signal);
        }
    });
});

server.listen(8080, () => {
    console.log(`Servidor escuchando en el puerto ${8080}`);
});
