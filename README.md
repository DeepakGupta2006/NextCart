# NextCart

A full-stack e-commerce app (React + Vite + Tailwind on the frontend, Node/Express + MongoDB on the backend). Brand palette is custom — pine green, amber, and coral — not the default Tailwind blue/indigo.

```
NextCart/
├── client/      React (Vite) frontend
├── server/      Node/Express + MongoDB backend
└── package.json convenience scripts
```

Everything below has already been checked: the backend files pass `node --check`, and `npm run build` on the client completes cleanly.

---

## 1. What you need installed first

- **Node.js 18+** and npm — check with `node -v` and `npm -v`
- **MongoDB** — either:
  - installed locally (`mongod` running on `localhost:27017`), or
  - a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (gives you a connection string instead)

---

## 2. Get the code onto your machine

Unzip the `NextCart` folder anywhere, then open a terminal inside it.

---

## 3. Set up the backend

```bash
cd NextCart/server
npm install
```

Create your real environment file from the example:

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/nextcart
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

- If you're using **Atlas**, replace `MONGO_URI` with the connection string Atlas gives you (it looks like `mongodb+srv://user:pass@cluster.mongodb.net/nextcart`).
- Replace `JWT_SECRET` with any long random string — this signs login tokens.

**(Optional but recommended)** Seed the database with 8 sample products so the shop isn't empty:

```bash
npm run seed
```

Start the API server:

```bash
npm run dev
```

You should see `MongoDB connected` and `NextCart API running on http://localhost:5000`. Leave this terminal open.

---

## 4. Set up the frontend

Open a **second terminal**:

```bash
cd NextCart/client
npm install
npm run dev
```

Vite will print a local URL, normally `http://localhost:5173`. Open that in your browser — the frontend is pre-configured to proxy `/api` calls to `http://localhost:5000`, so no extra config is needed.

---

## 5. Try it out

1. Go to `http://localhost:5173`
2. Click **Sign in → New here? Create an account** and register a user
3. Browse **Men / Women / Kids / Accessories**, add something to your bag, and check out with **Cash on delivery**
4. To use the **admin dashboard**, open MongoDB (Compass, Atlas UI, or `mongosh`) and change your user's `role` field from `"user"` to `"admin"`:
   ```js
   db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
   ```
   Then log out and back in — an **Admin** link will appear in the navbar, letting you manage products, orders, and users.

---

## 6. Notes on payments

`paymentMethod: "razorpay"` in checkout currently just marks the order as paid immediately as a placeholder — it does **not** call the real Razorpay API. To go live with real payments:

1. Create a Razorpay account and get your Key ID / Key Secret.
2. Add them to `server/.env`.
3. In `server/src/controllers/orderController.js`, create a Razorpay order via their SDK before creating your own `Order`, and verify the payment signature on a webhook or a `/verify` route.
4. On the frontend, load Razorpay's checkout.js script and open their payment widget before calling `placeOrder`.

## 7. Notes on product images

Products store `images` as an array of URLs (see the admin "New product" form — paste comma-separated URLs). For real image uploads, wire up `server/src/config/cloudinary.js` with your Cloudinary credentials and add a `multer` upload route; the folder structure already has a place for this.

---

## 8. Deploying

- **Backend**: deploy `server/` to Render, Railway, or any Node host; set the same environment variables there, and point `MONGO_URI` at Atlas.
- **Frontend**: run `npm run build` inside `client/`, then deploy the generated `dist/` folder to Vercel, Netlify, or similar. Update the frontend's API base URL (in `client/src/services/api.js`) to your deployed backend's URL, since the Vite dev proxy only works locally.

---

## Tech stack

**Frontend:** React 18, Vite, React Router, Tailwind CSS, Axios, react-hot-toast
**Backend:** Node.js, Express, MongoDB + Mongoose, JWT auth, bcryptjs, express-rate-limit
