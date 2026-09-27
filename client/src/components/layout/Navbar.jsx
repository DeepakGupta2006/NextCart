import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { CATEGORIES } from "../../utils/constants";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-pine-100 bg-linen/95 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-700 tracking-tight text-pine-500">
          Next<span className="text-amber-500">Cart</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to={`/shop/${c.key}`}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-pine-500"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative flex items-center gap-1 text-sm font-semibold text-pine-500">
            Bag
            {itemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[11px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              {user.role === "admin" && (
                <Link to="/admin" className="text-sm font-medium text-pine-500 hover:underline">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="text-sm font-medium text-ink/80 hover:text-pine-500">
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-2 text-xs">
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary !px-4 !py-2 text-xs hidden md:inline-flex">
              Sign in
            </Link>
          )}

          <button
            className="md:hidden text-pine-500"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-pine-100 bg-linen md:hidden">
          <div className="container-app flex flex-col gap-3 py-4">
            {CATEGORIES.map((c) => (
              <Link key={c.key} to={`/shop/${c.key}`} onClick={() => setOpen(false)} className="text-sm font-medium text-ink/80">
                {c.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="text-sm font-medium text-ink/80">
                  My profile
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-medium text-pine-500">
                    Admin dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="text-left text-sm font-medium text-coral-600">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="text-sm font-semibold text-pine-500">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
