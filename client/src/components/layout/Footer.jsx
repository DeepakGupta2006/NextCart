import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-20 border-t border-pine-100 bg-pine-500 text-linen">
    <div className="container-app grid gap-10 py-14 md:grid-cols-4">
      <div>
        <p className="font-display text-lg font-semibold text-linen">
          Next<span className="text-amber-500">Cart</span>
        </p>
        <p className="mt-3 max-w-xs text-sm text-pine-100">
          Everyday clothing, made from materials that last and priced without the markup.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-500">Shop</p>
        <ul className="mt-3 space-y-2 text-sm text-pine-100">
          <li><Link to="/shop/men">Men</Link></li>
          <li><Link to="/shop/women">Women</Link></li>
          <li><Link to="/shop/kids">Kids</Link></li>
          <li><Link to="/shop/accessories">Accessories</Link></li>
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-500">Help</p>
        <ul className="mt-3 space-y-2 text-sm text-pine-100">
          <li>Shipping & returns</li>
          <li>Size guide</li>
          <li>Track an order</li>
          <li>Contact us</li>
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold text-amber-500">Stay in the loop</p>
        <p className="mt-3 text-sm text-pine-100">Get early access to new drops and restocks.</p>
        <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="you@example.com" className="w-full rounded-md border-0 bg-pine-600 px-3 py-2 text-sm text-linen placeholder:text-pine-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          <button className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-ink">Join</button>
        </form>
      </div>
    </div>
    <div className="border-t border-pine-600 py-5 text-center text-xs text-pine-100">
      © {new Date().getFullYear()} NextCart. All rights reserved.
    </div>
  </footer>
);

export default Footer;
