# 🛒 e-cart — Full Stack E-Commerce App

A production-ready, fully responsive React e-commerce application with a custom Node.js/Express backend. Features complete multi-page navigation, cart management, wishlist storage, authentication, and category filtering. Data is persistently stored using a lightweight JSON-file database.

---

## 📁 Project Structure

The project has been scaled into a pristine Full Stack architecture with separated client and server codebases.

```
ecart/
├── frontend/                     # React User Interface (Vite)
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── context/AppContext.jsx # Global State (Fetches & syncing data)
│       ├── data/products.js       # Product catalog
│       ├── pages/                 # Home, Cart, Login, OrdersPage, etc.
│       └── components/            # Reusable UI (Navbar, ProductCard)
│
└── backend/                      # Node.js + Express API
    ├── server.js                 # API Entry Point (Port 5001)
    ├── package.json
    ├── data/
    │   ├── login.json            # Persistent User Accounts database
    │   ├── orders.json           # Persistent Checkout History database
    │   └── wishlist.json         # Persistent User Favorites database
    └── src/
        ├── app.js                # Express App (CORS, JSON routing)
        ├── routes/               # API endpoints (/auth, /orders, /wishlist)
        └── controllers/          # Business logic handling file storage
```

---

## ✅ Features

### 💻 Backend Functions
- **File System Database** — No MongoDB required! Stores all records directly inside local `data/*.json` files for easy debugging, college assignments, and local testing.
- **REST APIs** — Robust routing for processing orders, registering users, and retrieving wishlist items.
- **Data Persistence** — Logs out and logs back in? The AppContext automatically reaches into the Node servers and downloads your personal cart/wishlist histories flawlessly.

### 🏠 Frontend Pages
- **Home** — Announcement bar, hero, 6-category grid, trending products, feature badges
- **Category Pages** — Groceries, Footwear, Clothes, Electronics, Beauty, Home (Live filtering/sorting)
- **Product Detail** — Image, description tabs, qty selector, heart icon mapped to the API
- **Login/Signup** — Email/password with validation, dynamic password strength energy meter!
- **Cart** — Checkout with strict 6-digit PIN validation, coupon codes, and API order processing.
- **My Orders** — Track past purchases. Automatically updates flag to "Delivered" exactly 3 days after ordering.

---

## 🚀 Setup & Execution

To run the full stack application, you need to start **both** the backend and the frontend servers in separate terminal windows.

### 1. Start the Node.js Backend

Open your first terminal and navigate to the backend folder:
```bash
cd ecart/backend
npm install
npm run dev
```
*(The API will successfully spin up on `http://localhost:5001` and await requests).*

### 2. Start the React Frontend

Open a new, second terminal window and navigate to the frontend folder:
```bash
cd ecart/frontend
npm install
npm run dev
```
*(The website will spin up on `http://localhost:5175`. Open this in your browser!).*

---

### 🎟️ Coupon Codes (Cart Page)
| Code      | Discount |
|-----------|----------|
| ECART10   | 10% off  |
| SAVE20    | 20% off  |
| FIRST50   | 50% off  |

---

## 📱 Responsive Breakpoints
- **Desktop**: Full multi-column layouts
- **Tablet** (≤1024px): 2-column grids
- **Mobile** (≤768px): Single column, hamburger nav, touch-friendly buttons

---

Built with ❤️ using React, Vite, Node.js, and Express