require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

app.listen(PORT, () => {
    console.log(`E-cart Backend Server running on http://localhost:${PORT}`);
});
