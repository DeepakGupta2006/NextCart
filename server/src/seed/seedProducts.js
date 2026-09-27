require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

const slugify = (text) =>
  text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") +
  "-" +
  Math.random().toString(36).slice(2, 7);

const sample = [
  { name: "Pine Ridge Overshirt", category: "men", price: 2499, discountPrice: 1999, stock: 40, isFeatured: true, sizes: ["S", "M", "L", "XL"], colors: ["Pine", "Charcoal"], description: "A heavyweight cotton overshirt built for layering through the cooler months.", images: ["https://plus.unsplash.com/premium_photo-1670090780560-bcb7ee7da281?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { name: "Amber Field Jacket", category: "men", price: 4299, discountPrice: 0, stock: 25, isFeatured: true, sizes: ["M", "L", "XL"], colors: ["Amber", "Black"], description: "Water-resistant field jacket with a brushed interior lining.", images: ["https://plus.unsplash.com/premium_photo-1661313817350-1fa759c43a3b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { name: "Linen Drift Dress", category: "women", price: 2899, discountPrice: 2399, stock: 30, isFeatured: true, sizes: ["XS", "S", "M", "L"], colors: ["Ivory", "Coral"], description: "Breathable linen-blend dress designed for warm-weather ease.", images: ["https://images.unsplash.com/photo-1686317278589-929594a9fe90?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { name: "Coral Knit Cardigan", category: "women", price: 1999, discountPrice: 0, stock: 35, isFeatured: false, sizes: ["S", "M", "L"], colors: ["Coral", "Pine"], description: "Soft ribbed-knit cardigan with mother-of-pearl buttons.", images: ["https://plus.unsplash.com/premium_photo-1706520001443-e099ad30b807?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { name: "Sprout Graphic Tee", category: "kids", price: 799, discountPrice: 599, stock: 60, isFeatured: true, sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: ["Amber", "Ivory"], description: "Soft organic cotton tee with a playful hand-drawn print.", images: ["https://plus.unsplash.com/premium_photo-1691367782367-2bd37f646abc?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { name: "Trailblazer Joggers", category: "kids", price: 1299, discountPrice: 0, stock: 45, isFeatured: false, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Charcoal"], description: "Durable joggers with reinforced knees for active days.", images: ["https://plus.unsplash.com/premium_photo-1706151505903-cbc06977f01d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { name: "Harbor Canvas Tote", category: "accessories", price: 1499, discountPrice: 1199, stock: 50, isFeatured: true, sizes: [], colors: ["Pine", "Ivory"], description: "Heavy canvas tote with leather straps, built to last.", images: ["https://media.istockphoto.com/id/2292040285/photo/beach-bag-with-accessories-isolated-on-white.jpg?s=1024x1024&w=is&k=20&c=EAQL0itSF8YUY7p4c21OiQSWPYdGXq7iT3oJaIzG_1s="] },
  { name: "Amber Sun Cap", category: "accessories", price: 699, discountPrice: 0, stock: 70, isFeatured: false, sizes: ["One Size"], colors: ["Amber"], description: "Structured six-panel cap in brushed cotton twill.", images: ["https://images.unsplash.com/photo-1645266729222-17cd32e06fd0?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QW1iZXIlMjBTdW4lMjBDYXAlNUR8ZW58MHx8MHx8fDA%3D"] },
  { name: "Cedar Flannel Shirt", category: "men", price: 1899, discountPrice: 1599, stock: 45, isFeatured: true, sizes: ["S", "M", "L", "XL"], colors: ["Charcoal", "Pine"], description: "A brushed cotton flannel button-up with a soft, worn-in feel from the first wear.", images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAVoRsvchqVVJYlPS4q2k5Tjjmz2i1b2BYyAqtQA5ZBg&s"] },
  { name: "Coastal Linen Shirt", category: "men", price: 1699, discountPrice: 0, stock: 38, isFeatured: false, sizes: ["S", "M", "L", "XL"], colors: ["Ivory", "Pine"], description: "A lightweight linen button-up that breathes easy through warm afternoons.", images: ["https://thomasscott.in/cdn/shop/files/NEWTS1324_Green-2_1731408041.webp?v=1780200847&width=300"] },
  { name: "Basecamp Henley Tee", category: "men", price: 999, discountPrice: 799, stock: 55, isFeatured: true, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Charcoal", "Amber"], description: "A midweight henley tee with a three-button placket, built for everyday layering.", images: ["https://www.jockey.in/cdn/shop/files/US87_BLACK_0105_S223_JKY_5.webp?v=1725619864&width=720"] },
  { name: "Amber Stripe Polo", category: "men", price: 1399, discountPrice: 1099, stock: 32, isFeatured: true, sizes: ["S", "M", "L", "XL"], colors: ["Amber", "Ivory"], description: "A pique-knit polo with a subtle stripe, dressed up enough for the office and relaxed enough for the weekend.", images: ["https://plus.unsplash.com/premium_photo-1763898811209-8b4e23994040?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
  { name: "Charcoal Oxford Shirt", category: "men", price: 2099, discountPrice: 0, stock: 28, isFeatured: false, sizes: ["S", "M", "L", "XL"], colors: ["Charcoal", "Ivory"], description: "A structured Oxford weave button-down that moves easily from desk to dinner.", images: ["https://images.unsplash.com/photo-1698720642529-1defa5910184?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"] },
];
(async () => {
  await connectDB();
  await Product.deleteMany({});
  const withSlugs = sample.map((p) => ({ ...p, slug: slugify(p.name) }));
  await Product.insertMany(withSlugs);
  console.log(`Seeded ${withSlugs.length} products.`);
  await mongoose.connection.close();
  process.exit(0);
})();