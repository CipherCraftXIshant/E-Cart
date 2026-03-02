# 🛒 e-cart — Full React E-Commerce App

A production-ready, fully responsive React e-commerce landing page with complete multi-page navigation, cart, wishlist, auth, and category pages.

---

## 📁 Project Structure

```
ecart/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Router + all page wiring
    ├── styles/
    │   └── global.css            # CSS variables, animations, utilities
    ├── context/
    │   └── AppContext.jsx         # Global state: cart, wishlist, auth, toast
    ├── data/
    │   └── products.js           # All product data (40+ products), reviews, categories
    ├── components/
    │   ├── Navbar.jsx             # Sticky navbar, search, account dropdown, hamburger
    │   ├── ProductCard.jsx        # Reusable product card with hover effects
    │   ├── Footer.jsx             # Footer with links, payments, social
    │   └── Toast.jsx              # Global toast notifications
    └── pages/
        ├── Home.jsx               # Landing: Announcement, Hero, Categories, Trending, Reviews, Features
        ├── CategoryPage.jsx       # Dynamic page for all 6 categories (with filters, sort, search)
        ├── ProductDetail.jsx      # Full product detail with qty, wishlist, tabs, related
        ├── Login.jsx              # Login form with validation + social login
        ├── Signup.jsx             # Signup with password strength, multi-field validation
        ├── Cart.jsx               # Cart with coupon codes, qty update, order summary
        ├── Wishlist.jsx           # Saved wishlist items
        └── SearchResults.jsx      # Search across all products
```

---

## ✅ Features

### 🏠 Pages
- **Home** — Announcement bar, hero, 6-category grid, trending products, auto-sliding reviews, feature badges
- **Category Pages** — Groceries, Footwear, Clothes, Electronics, Beauty, Home Essentials (each with real products)
- **Product Detail** — Image, description tabs, qty selector, wishlist, related products
- **Login** — Email/password with validation, social login buttons
- **Signup** — Full form with password strength meter, terms checkbox
- **Cart** — Qty controls, coupon codes (ECART10/SAVE20/FIRST50), delivery logic
- **Wishlist** — Persisted across navigation
- **Search** — Full-text search across all products
- **Order Tracking** — Enter order ID, see step-by-step progress
- **About / Contact** — Info pages with contact form

### 🛠️ Functionality
- ✅ Global state via React Context (no Redux needed)
- ✅ Cart: add, remove, update qty, coupon codes, totals
- ✅ Wishlist: toggle save/unsave from any page
- ✅ Auth: login/logout with user state
- ✅ Toast notifications for all actions
- ✅ Sticky Navbar — closes dropdown on outside click, not on scroll
- ✅ Category filter: in-stock, min rating, max price
- ✅ Sort: price, rating, discount
- ✅ Responsive: mobile hamburger menu, responsive grids

### 🎨 Design
- Saffron `#f97316` + cream `#fff7ed` + warm beige `#fdf3e3` palette
- Playfair Display (headings) + DM Sans (body)
- CSS animations: floating blobs, blink-glow, auto-scroll reviews, hover lifts
- No external dependencies except React + Vite

---

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

### Coupon Codes (Cart Page)
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
- **Small** (≤480px): Stacked everything

---

Built with ❤️ using React 18 + Vite 5