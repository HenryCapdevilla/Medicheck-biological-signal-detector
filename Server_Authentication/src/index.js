import fs from "fs";
import https from "https";
import app from "./app.js";
import { connectDB } from "./db.js";

connectDB();

// Configuración de certificados SSL
const options = {
    key: fs.readFileSync("/etc/ssl/private/clave.key"),
    cert: fs.readFileSync("/etc/ssl/certs/fullchain.pem"),
};

// Crear servidor HTTPS
const server = https.createServer(options, app);

// Escuchar en el puerto HTTPS
server.listen(3001, () => {
    console.log("Servidor de autenticación escuchando en HTTPS");
});
