const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://glittery-mermaid-4276f1.netlify.app", "*"],  // הוסף את הדומיין של Netlify
        methods: ["GET", "POST"],
        credentials: true
    },
    path: "/socket.io/",
    pingInterval: 25000,
    pingTimeout: 60000
});

app.get('/', (req, res) => {
    res.send('<h1>✅ WebRTC Signaling Server is running!</h1><p>Connect from broadcast.html and viewer.html</p>');
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('offer', (offer) => {
        console.log('Received offer');
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        console.log('Received answer');
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        console.log('Received candidate');
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});