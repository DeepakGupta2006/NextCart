# NextCart

A full-stack e-commerce web app for a fashion/apparel store — built on the MERN stack (MongoDB, Express, React, Node.js) with a custom design system, real payment processing, and cloud image hosting.

---

## ✨ Features

### Customer-facing
- Browse products by category — Men, Women, Kids, Accessories
- Search, filter by price, and sort by price/rating
- Product detail pages with size/color selection and stock awareness
- Persistent shopping cart tied to your account
- Full checkout flow with shipping address management
- **Real online payments via Razorpay**, with server-side signature verification (never trusts the client's word that payment succeeded)
- Cash on Delivery as an alternative payment method
- Order history and order status tracking
- JWT-based authentication (register/login), with profile management

### Admin dashboard
- Product management — create, edit, delete, with **drag-and-drop / file-picker image uploads to Cloudinary**
- Order management — view all orders, update status (pending → processing → shipped → delivered)
- User management — view all accounts, enable/disable access

### Engineering details worth knowing
- Passwords hashed with bcrypt; JWT auth on protected routes
- Rate limiting on auth and general API routes
- Razorpay payments verified via HMAC-SHA256 signature recomputation server-side — the amount charged is always derived from the user's live cart total, never trusted from the frontend
- Image uploads go straight to Cloudinary via in-memory buffer streaming (no files ever touch local disk)
- Custom Tailwind color system (`pine`, `amber`, `coral`, `linen`, `ink`) instead of default framework colors, for a distinct brand identity

---

## 🧱 Tech Stack

**Frontend:** React 18 (Vite), React Router, Tailwind CSS, Axios, react-hot-toast
**Backend:** Node.js, Express, MongoDB + Mongoose, JWT, bcryptjs, express-rate-limit
**Payments:** Razorpay (Orders API + signature verification)
**Media:** Cloudinary (image hosting) + Multer (in-memory upload handling)

---

## 📁 Project Structure

```
NextCart/
├── client/                  # React (Vite) frontend
│   ├── public/
│   └── src/
│       ├── components/      # layout, product, cart, common
│       ├── context/         # AuthContext, CartContext
│       ├── hooks/           # useAuth, useCart
│       ├── pages/           # Home, Shop, ProductDetail, Cart, Checkout, Auth, Profile, Admin
│       ├── services/        # API calls (auth, product, cart, order, payment, address)
│       └── utils/
│
├── server/                  # Express + MongoDB backend
│   ├── src/
│   │   ├── config/          # db, jwt, razorpay, cloudinary
│   │   ├── controllers/     # auth, product, cart, order, payment, upload, address, user
│   │   ├── middleware/      # auth, rate limiting, uploads, error handling
│   │   ├── models/          # User, Product, Cart, Order, Review
│   │   ├── routes/
│   │   ├── seed/            # sample product seed script
│   │   └── utils/           # shared pricing logic, response helpers
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (local, or free on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A free [Razorpay](https://dashboard.razorpay.com) account (Test Mode keys) for payments
- A free [Cloudinary](https://cloudinary.com) account for image uploads

### 1. Clone and install
```bash
git clone <your-repo-url>
cd NextCart
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables
Copy the example file and fill in your own values:
```bash
cd server
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the API runs on (default `5000`) |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Any long random string, used to sign auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin, for CORS (`http://localhost:5173`) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | From your Razorpay dashboard's API Keys |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |

### 3. Seed sample data (optional)
```bash
npm run seed
```
This wipes and repopulates the `products` collection with starter items — useful for a first run, but skip it later if you've since added your own products through the admin panel (it deletes everything first).

### 4. Run it
In one terminal:
```bash
cd server && npm run dev
```
In another:
```bash
cd client && npm run dev
```
Visit **http://localhost:5173**.

### 5. Get admin access
Register an account on the site, then in your database, find your user document in the `users` collection and change:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```
Log out and back in — an **Admin** link appears in the navbar.

---

## 💳 Payments

Razorpay is fully wired up in Test Mode by default:

1. The backend creates a Razorpay order sized to the user's live cart total (`POST /api/payment/razorpay/order`)
2. The frontend opens Razorpay's checkout widget with that order
3. On success, the payment proof (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`) is sent to `POST /api/orders`
4. **The backend recomputes the HMAC-SHA256 signature itself** using the Razorpay key secret, and only marks the order as paid if it matches — client-reported success is never trusted alone

Use Razorpay's [test card numbers](https://razorpay.com/docs/payments/payments/test-card-details/) (e.g. `4111 1111 1111 1111`, any future expiry/CVV) to test without real transactions. Switching to live payments later is just a matter of swapping Test keys for Live keys in `.env` — no code changes required.

---

## 🖼️ Image Uploads

Product images can be added two ways from the admin panel:
- **Upload real files** — dragged/selected images are streamed straight to Cloudinary and the URL is filled in automatically
- **Paste external URLs** — comma-separated, for quick prototyping with stock photos

> **Note on placeholder/stock images:** if you're populating products with photos from external sites (stock photo sites, marketplaces, etc.), make sure you have the rights to use them — this matters especially before deploying the site publicly. Paid/licensed stock photos (e.g. Unsplash+, iStock, or product photography from other retailers) generally aren't licensed for reuse on an unrelated storefront.

---

## 📡 API Overview

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` , `/api/auth/login` | Auth |
| `GET`/`PUT` | `/api/auth/me` | Current user profile |
| `GET` | `/api/products` | List products (filter/search/sort/paginate) |
| `POST`/`PUT`/`DELETE` | `/api/products` | Admin product CRUD |
| `POST` | `/api/products/upload` | Admin image upload to Cloudinary |
| `GET`/`POST`/`PUT`/`DELETE` | `/api/cart` | Cart management |
| `POST` | `/api/orders` | Place an order (COD or Razorpay) |
| `GET` | `/api/orders/mine` , `/api/orders` | Order history / admin order list |
| `PUT` | `/api/orders/:id/status` | Admin order status update |
| `POST` | `/api/payment/razorpay/order` | Create a Razorpay order for checkout |
| `GET`/`POST`/`PUT`/`DELETE` | `/api/addresses` | Saved shipping addresses |
| `GET`/`PUT` | `/api/users` | Admin user management |

---

## 📄 License

This project is available under the MIT License — feel free to use it as a learning reference or a starting point for your own store.

---

## Author

**Deepak Gupta**
[GitHub](https://github.com/DeepakGupte2006) · [LinkedIn](https://linkedin.com/in/deepakgupta) · your.email@dg7842661@gmail.com
