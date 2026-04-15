const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",           // זמנית – כדי ש-Netlify יתחבר
        methods: ["GET", "POST"],
        credentials: true
    },
    path: "/socket.io/"        // ברירת מחדל – חשוב לא לשנות
});

app.get('/', (req, res) => {
    res.send('<h1>✅ WebRTC Signaling Server פועל!</h1><p>השתמש ב-broadcast.html ו-viewer.html כדי להתחבר.</p>');
});

io.on('connection', (socket) => {
    console.log('משתמש התחבר:', socket.id);

    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('משתמש התנתק:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 שרת פועל על פורט ${PORT}`);
});