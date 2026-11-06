const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// Routes
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/boards', require('./routes/Boards'));
app.use('/api/tasks', require('./routes/Tasks'));

// Socket.io real-time connection mapping
const userSockets = {};
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('register', (userId) => {
        userSockets[userId] = socket.id;
    });

    socket.on('sendNotification', (data) => {
        const recipientSocket = userSockets[data.recipientId];
        if (recipientSocket) {
            io.to(recipientSocket).emit('notification', data);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error('Database connection error:', err));