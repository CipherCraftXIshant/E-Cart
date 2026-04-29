# 🛒 e-cart — Full Stack MERN E-Commerce App

A production-ready, fully responsive full-stack e-commerce application built using the **MERN** stack (MongoDB, Express, React, Node.js). 

Features complete multi-page navigation, cart management, wishlist storage, order history tracking, advanced authentication (HttpOnly Cookie JWT + Google OAuth), real-time Socket.io features, and seamless Cloudinary integration for image uploads.

---

## 🆕 What We Recently Changed (Latest Updates)

We recently performed a major system stabilization and feature upgrade:
1. **Upgraded Authentication Security**: Migrated JWT storage from insecure `localStorage` to **Secure `HttpOnly` Cookies**. The browser now handles token transmission automatically, protecting users against XSS attacks.
2. **Real-Time Order Tracking**: Integrated **Socket.io** into the `OrdersPage`. When the backend updates an order status (e.g., from "Processing" to "Delivered"), the user's screen updates instantly with a live 🔴 LIVE pulse animation—no page refresh required!
3. **Global Flash Sales System**: Added an admin-controlled Flash Sale engine. Using the `/api/flash/start` endpoint, admins can broadcast a global discount code that instantly drops down an animated banner on every active shopper's screen using Socket.io.

---

## 🛠️ Technologies Used

### Frontend (Client)
* **React + Vite**: For blazing-fast UI rendering and modern development experience.
* **Context API**: For lightweight, robust global state management (handling carts, wishlists, and user sessions).
* **Socket.io-Client**: Enables real-time bi-directional communication for live order updates and flash sale banners.
* **Vanilla CSS**: For custom, high-performance styling using CSS variables and modern grid/flexbox layouts.

### Backend (Server)
* **Node.js + Express**: Serves as the robust RESTful API backend handling all business logic.
* **MongoDB + Mongoose**: A NoSQL database for secure, scalable data storage of Users, Orders, and Wishlists.
* **Socket.io**: Real-time websocket server running alongside Express to push live events to connected clients.
* **JSON Web Tokens (JWT) & Cookies**: Used for stateless, cryptographically secure user authentication.
* **Passport.js + Google OAuth 2.0**: Enables seamless "Login with Google" capabilities, automatically registering users.
* **Cloudinary + Multer**: Provides a robust, cloud-based image hosting infrastructure for user avatars.

---

## 🔌 API Documentation (All 18 Endpoints)

Here is a complete list of all the backend APIs we built and use in this project:

### 👤 Authentication API (`/api/auth`)
* `POST /api/auth/signup` - Registers a new user.
* `POST /api/auth/login` - Authenticates user with email/password and returns an HttpOnly JWT cookie.
* `POST /api/auth/logout` - Clears the authentication cookies.
* `PUT /api/auth/profile` - Updates the user's name or avatar **(Protected)**.
* `GET /api/auth/google` - Initiates the Google OAuth login flow.
* `GET /api/auth/google/callback` - Handles the redirect and login from Google.

### 📦 Product API (`/api/products`)
* `GET /api/products/` - Fetches the catalog of all products to display on the Home and Category pages.
* `POST /api/products/seed` - Utility endpoint to populate the database with dummy product data.

### 🛒 Order API (`/api/orders`)
* `POST /api/orders/` - Creates a new order from the cart **(Protected)**.
* `GET /api/orders/:userId` - Fetches the order history for a specific logged-in user **(Protected)**.
* `GET /api/orders/` - Fetches all orders globally (useful for an admin dashboard).

### ❤️ Wishlist API (`/api/wishlist`)
* `GET /api/wishlist/:userId` - Fetches the saved wishlist items for a specific user **(Protected)**.
* `POST /api/wishlist/toggle` - Adds or removes a product from the user's permanent wishlist **(Protected)**.

### ⭐ Review API (`/api/reviews`)
* `GET /api/reviews/:productId` - Fetches all reviews left on a specific product.
* `POST /api/reviews/` - Allows a user to submit a new rating and review for a product **(Protected)**.

### ⚡ Flash Sale API (`/api/flash`)
* `POST /api/flash/start` - Broadcasts a global flash sale to all connected users via socket.io.
* `POST /api/flash/end` - Ends the global flash sale early.

### 🖼️ Image Upload API (`/api/upload`)
* `POST /api/upload/` - Uploads user avatars to Cloudinary and returns the hosted image URL **(Protected)**.

*(Note: **Protected** means the API requires the user to have a valid JWT token stored in their browser's HttpOnly cookie).*

---

## 🛤️ User Flow Examples (What happens when...)

### Example 1: Placing an Order
1. **User Action**: The user adds items to their Cart and clicks **"Place Order"**.
2. **Frontend Logic**: `AppContext` gathers the Cart data, calculates the total, and makes a `POST` request to `/api/orders/`. It sends `credentials: 'include'` so the browser automatically attaches the secure HttpOnly JWT cookie.
3. **Middleware**: The backend `auth.middleware.js` intercepts the request, reads the cookie, verifies the JWT signature, and identifies exactly *who* the user is.
4. **Database Execution**: The `order.controller.js` creates a new Order document in MongoDB linked to that specific user ID.
5. **Real-time Magic**: Before responding, the controller uses `Socket.io` to emit an `order:new` event back to that specific user.
6. **Result**: The frontend receives a 201 Success status, clears the local cart, redirects the user to the `OrdersPage`, and shows a "Success" toast notification!

### Example 2: Real-time Flash Sale
1. **Admin Action**: An admin uses a tool like Postman or Curl to hit `POST /api/flash/start` with a body like `{ "discount": 50, "code": "FLASH50" }`.
2. **Backend Broadcast**: The `flash.controller.js` saves this data to memory and uses `io.emit('flashSale:start')` to broadcast it to the WebSocket server.
3. **Frontend Reaction**: Every single user currently browsing the website has an active Socket.io connection in their `AppContext.jsx`. They all receive this event simultaneously.
4. **Result**: The `FlashSaleBanner.jsx` component detects the new state, and a colorful, animated 50% OFF banner drops down from the top of the screen with a live countdown timer for *everyone* browsing the site.

---

## 🚀 How to Run the Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed on your machine.

### 1. Clone & Install
Open your terminal and install dependencies for both the frontend and backend.
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file inside the `backend` folder and add your configuration secrets:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/ecart

# Security
JWT_SECRET=your_super_secret_jwt_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary Image Hosting
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start the Application
You will need two separate terminal windows running simultaneously.

**Terminal 1: Start the Backend Server**
```bash
cd backend
npm run dev
```
*(Server runs on http://localhost:3000)*

**Terminal 2: Start the Frontend React App**
```bash
cd frontend
npm run dev
```
*(App runs on http://localhost:5173)*

Open your browser to `http://localhost:5173` to start shopping!