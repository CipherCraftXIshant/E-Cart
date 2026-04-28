const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const reviewRoutes = require('./routes/review.routes');
const uploadRoutes = require('./routes/upload.routes');

const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true  // Required for cookies to be sent cross-origin
}));
app.use(express.json());
app.use(cookieParser()); // Parse cookies from every request


const session = require("express-session");
const passport = require("./config/passport");

app.use(
  session({
    secret: process.env.JWT_SECRET || "fallback_session_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const productRoutes = require('./routes/product.routes');
const flashRoutes = require('./routes/flash.routes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/flash', flashRoutes);

module.exports = app;
