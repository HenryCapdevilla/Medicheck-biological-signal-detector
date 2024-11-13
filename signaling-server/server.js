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

function areUsersInSameRoom(userID1, userID2, rooms) {
    for (const roomID in rooms) {
      const usersInRoom = Object.values(rooms[roomID]);
      if (usersInRoom.includes(userID1) && usersInRoom.includes(userID2)) {
        return roomID; // Devuelve el RoomID si ambos usuarios están en la misma sala
      }
    }
    return null; // Si no están en la misma sala
  };

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

    // Registrar evento 'callUser'
    socket.on("callUser", (data) => {
        const { userToCall, from } = data;
        
        console.log(typeof rooms);
        console.log("Usuario que llama:", userToCall);
        console.log("Usuario que recibe:", from);
    
        const roomID = areUsersInSameRoom(userToCall, from, rooms);
        // Validación de la sala
        console.log("userRoom encontrado:", roomID);
    
        // Solo permite la llamada si ambos usuarios están en la misma sala
        if (roomID) {
            console.log(`Llamada iniciada de ${from} a ${userToCall} en la sala ${roomID}`);
            io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
        } else {
            console.log(`Llamada no permitida: ${from} y ${userToCall} no están en la misma sala.`);
        }
    
        console.log("Estado actual de rooms:", JSON.stringify(rooms, null, 2));
    });


    // Registrar evento 'answerCall'
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
        console.log("Estado actual de rooms:", JSON.stringify(rooms, null, 2));
    });
});

server.listen(8080, () => {
    console.log(`Servidor escuchando en el puerto 8080`);
});
