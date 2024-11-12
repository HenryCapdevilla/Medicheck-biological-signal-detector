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

let users = {}; // Almacena los usuarios con su email como clave

io.on("connection", (socket) => {
    socket.on("registerUser", (data) => {
        // Si ya existe el usuario, no lo agregamos de nuevo
        if (users[data.email]) {
            console.log(`El usuario con el id ${data.Username} ya está conectado.`);
            socket.emit("me", users[data.Username]);
        } else {
            console.log(`Usuario nuevo registrado: ${data.Username}`);
            users[data.Username] = socket.id; // Asocia el email con el socket ID
            socket.emit("me", socket.id); // Devuelve el socket ID al cliente
        }
    });

    socket.on("disconnect", () => {
        // Elimina al usuario de la lista cuando se desconecte
        for (const [Username, id] of Object.entries(users)) {
            if (id === socket.id) {
                delete users[Username];
                break;
            }
        }
    });
    
    // Registrar desconexión del usuario
    socket.on("disconnect", () => {
        console.log(`Usuario desconectado: ${socket.id}`);
        socket.broadcast.emit("callEnded");
    });

    // Registrar evento 'callUser'
    socket.on("callUser", (data) => {
        console.log(`Llamada iniciada de ${data.from} a ${data.userToCall}`);
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name });
    });

    // Registrar evento 'answerCall'
    socket.on("answerCall", (data) => {
        console.log(`Usuario ${data.to} aceptó la llamada de ${data.from}`);
        io.to(data.to).emit("callAccepted", data.signal);
    });
});

server.listen(8080, () => {
    console.log(`Servidor escuchando en el puerto ${8080}`);
});
