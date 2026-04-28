require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const socketManager = require('./src/socket');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

// Create HTTP server and attach socket.io
const httpServer = http.createServer(app);
socketManager.init(httpServer);

httpServer.listen(PORT, () => {
    console.log(`E-cart Backend Server running on http://localhost:${PORT}`);
    console.log(`[Socket.io] Real-time server ready ⚡`);
});
