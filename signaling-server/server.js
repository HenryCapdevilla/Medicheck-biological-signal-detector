const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
const rooms = {};  // Aquí se almacenarán los usuarios de cada sala
const waitingRooms = {};  // Usuarios que están en la sala de espera

server.on('connection', (ws) => {
    ws.on('message', (message) => {
    const data = JSON.parse(message);

    // eslint-disable-next-line default-case
    switch (data.type) {
        case 'createRoom': {
            const roomId = data.roomId;
            if (!rooms[roomId]) {
            rooms[roomId] = { participants: [], inCall: [] };
            waitingRooms[roomId] = [];
            }
            waitingRooms[roomId].push(ws);
            break;
        }
        case 'joinRoom': {
            const roomId = data.roomId;
            if (waitingRooms[roomId]) {
                waitingRooms[roomId].push(ws);
            } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
            }
            break;
        }
        case 'enterCall': {
            const roomId = data.roomId;
            if (waitingRooms[roomId]) {
                rooms[roomId].inCall.push(ws);  // Mover a la sala de videollamada
                waitingRooms[roomId] = waitingRooms[roomId].filter(client => client !== ws);
                if (rooms[roomId].inCall.length >= 2) {
                    // Notificar que la videollamada puede comenzar
                    rooms[roomId].inCall.forEach(client => {
                    client.send(JSON.stringify({ type: 'readyForCall', roomId }));
                    });
                }
            }
            break;
        }
        case 'offer': {
            const { roomId, offer } = data;
            rooms[roomId].inCall.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'offer', offer }));
            }
            });
            break;
        }
        case 'answer': {
            const { roomId, answer } = data;
            rooms[roomId].inCall.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'answer', answer }));
            }
            });
            break;
        }
        case 'candidate': {
            const { roomId, candidate } = data;
            rooms[roomId].inCall.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'candidate', candidate }));
            }
            });
            break;
        }
    }
});

    ws.on('close', () => {
        for (const roomId in waitingRooms) {
            waitingRooms[roomId] = waitingRooms[roomId].filter(client => client !== ws);
        }
        for (const roomId in rooms) {
            rooms[roomId].inCall = rooms[roomId].inCall.filter(client => client !== ws);
            }
        });
});
