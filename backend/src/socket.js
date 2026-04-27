// Shared Socket.io instance — import this in any controller to emit events
let io = null;
let activeFlashSale = null; // Remember current flash sale for late-joining sockets

module.exports = {
    init: (httpServer) => {
        const { Server } = require('socket.io');
        io = new Server(httpServer, {
            cors: {
                origin: ['http://localhost:5173', 'http://localhost:3000'],
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        io.on('connection', (socket) => {
            console.log(`[Socket.io] Client connected: ${socket.id}`);

            // If there's an active flash sale, immediately send it to the new connection
            if (activeFlashSale && new Date(activeFlashSale.endsAt) > new Date()) {
                socket.emit('flashSale:start', activeFlashSale);
            }

            // Each user joins their own private room using their userId
            socket.on('join', (userId) => {
                if (userId) {
                    socket.join(userId);
                    console.log(`[Socket.io] User ${userId} joined their room`);
                }
            });

            socket.on('disconnect', () => {
                console.log(`[Socket.io] Client disconnected: ${socket.id}`);
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) throw new Error('Socket.io not initialized! Call init() first.');
        return io;
    },
    setActiveFlashSale: (data) => { activeFlashSale = data; },
    clearActiveFlashSale: () => { activeFlashSale = null; }
};
