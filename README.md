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
    ├── server.js                 # API Entry Point (Port 3000)
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

### 💻 Backend API Documentation
This project uses a custom Node.js and Express REST API. Instead of a database like MongoDB or SQL, the backend uses Node's native `fs` module to securely perform **CRUD (Create, Read, Update, Delete)** operations directly on local JSON files (`login.json`, `orders.json`, `wishlist.json`). This ensures full data persistence perfectly suited for standalone applications.

#### 1. Authentication API (`/api/auth`)
- **`POST /api/auth/signup`**
  - **Function**: Creates a new user account.
  - **Body Payload**: `{ name, email, password }`
  - **Logic**: Reads `login.json`, verifies the email is unique, generates a `Date.now()` unique user ID, and saves the new profile.
- **`POST /api/auth/login`**
  - **Function**: Authenticates an existing user.
  - **Body Payload**: `{ email, password }`
  - **Logic**: Scans `login.json` for a matching email and password. Returns the user object (sans password) back to the React Context.

#### 2. Checkout & Orders API (`/api/orders`)
- **`POST /api/orders`**
  - **Function**: Processes a new cart checkout and saves the order history.
  - **Body Payload**: `{ userId, items, totalAmount }`
  - **Logic**: Validates the `userId` exists, calculates the exact Indian Standard Time (IST) offset using JS Date methods, and stores the full order structure into `orders.json`.
- **`GET /api/orders/:userId`**
  - **Function**: Retrieves a user's entire order history.
  - **Parameters**: `userId` (passed via the URL).
  - **Logic**: Filters out all matching past orders and sends an array back to the React `OrdersPage` component.

#### 3. Favorites / Wishlist API (`/api/wishlist`)
- **`POST /api/wishlist/toggle`**
  - **Function**: A dynamic smart-endpoint that handles both **Update** and **Delete** operations simultaneously.
  - **Body Payload**: `{ userId, product }`
  - **Logic**: Checks `wishlist.json`. If the user has already favorited the item, it splices (deletes) it from the array. If the item is new, it pushes (creates) it.
- **`GET /api/wishlist/:userId`**
  - **Function**: Fetches the user's permanent favorites list from the server to immediately restore the red-heart UI states upon logging in.

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

Built with ❤️ by Ishant using React, Vite, Node.js, and Express