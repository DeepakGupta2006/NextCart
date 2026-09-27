import { Link, Route, Routes, useLocation } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import UserManagement from "./UserManagement";

const links = [
  { to: "/admin", label: "Products", end: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
];

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="container-app py-10">
      <h1 className="text-2xl font-semibold text-ink">Admin dashboard</h1>
      <nav className="mt-6 flex gap-6 border-b border-pine-100">
        {links.map((l) => {
          const active = l.end ? location.pathname === l.to : location.pathname.startsWith(l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium ${
                active ? "border-pine-500 text-pine-500" : "border-transparent text-ink/60"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8">
        <Routes>
          <Route index element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
