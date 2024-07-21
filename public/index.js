const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const app = express();
app.use(express.static('public'));

const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

let fetch;
try {
    fetch = require('node-fetch');
} catch (err) {
    import('node-fetch').then(module => {
        fetch = module.default;
    });
}

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'records'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

app.post('/upload', upload.single('video'), (req, res) => {
    const inputPath = path.join(__dirname, 'records', req.file.filename);

    console.log(`Received file: ${req.file.filename}`);
    console.log(`Input path: ${inputPath}`);

    // Enviar el archivo al servidor Flask
    const formData = new FormData();
    formData.append('video', fs.createReadStream(inputPath), 'recorded-video.webm');

    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log('Video uploaded and processed successfully');
            console.log('g_values:', data.g_values);

            // Emitir los valores de 'g' a través de Socket.IO
            io.emit('g_values', data.g_values);

            res.status(200).json({ message: 'Video uploaded and processed successfully', g_values: data.g_values });

            console.log('Received g_values in JavaScript:', data.g_values);
        } else {
            console.error('Video upload or processing failed');
            res.status(500).json({ error: 'Video upload or processing failed' });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// obtiene la ruta del directorio publico donde se encuentran los elementos estaticos (css, js).
var publicPath = path.join(__dirname); 

// Para que los archivos estaticos queden disponibles.
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

// Manejar conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Cliente WebSocket conectado');
    // Manejar mensajes recibidos desde la ESP32
    socket.on('message', (data) => {
        console.log('Mensaje recibido desde la ESP32:', data);
      // Aquí puedes procesar los datos recibidos como desees
      // Por ejemplo, puedes enviar los datos a todos los clientes conectados para graficarlos en tiempo real
        io.emit('data_from_esp32', data);
    });
    // Manejar eventos de desconexión
    socket.on('disconnect', () => {
        console.log('Cliente WebSocket desconectado');
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
    console.log(publicPath);
});
