import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../../services/orderService";
import { CURRENCY } from "../../utils/constants";
import Loader from "../../components/common/Loader";

const statusColor = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-pine-50 text-pine-500",
  shipped: "bg-pine-50 text-pine-500",
  delivered: "bg-pine-500 text-linen",
  cancelled: "bg-coral-50 text-coral-600",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (orders.length === 0) return <p className="text-sm text-ink/60">You haven't placed any orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <Link
          to={`/order-success/${o._id}`}
          key={o._id}
          className="flex items-center justify-between rounded-lg border border-pine-100 bg-white p-4"
        >
          <div>
            <p className="text-sm font-medium text-ink">Order #{o._id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-ink/50">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span>
            <span className="text-sm font-semibold text-pine-500">{CURRENCY}{o.totalPrice}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MyOrders;
