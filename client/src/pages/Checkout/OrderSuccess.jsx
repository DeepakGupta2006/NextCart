import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrder } from "../../services/orderService";
import { CURRENCY } from "../../utils/constants";
import Loader from "../../components/common/Loader";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder(id).then(setOrder).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="container-app py-16 text-center">Order not found.</p>;

  return (
    <div className="container-app flex flex-col items-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-2xl">✓</div>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Order confirmed</h1>
      <p className="mt-2 text-sm text-ink/60">Order #{order._id.slice(-8).toUpperCase()}</p>
      <p className="mt-1 text-sm text-ink/60">
        Total paid: <span className="font-semibold text-pine-500">{CURRENCY}{order.totalPrice}</span>
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/profile/orders" className="btn-secondary">View my orders</Link>
        <Link to="/shop/men" className="btn-primary">Continue shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
