import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchAllOrders, updateOrderStatusApi } from "../../services/orderService";
import { CURRENCY } from "../../utils/constants";
import Loader from "../../components/common/Loader";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchAllOrders().then(setOrders).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatusApi(id, status);
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto rounded-lg border border-pine-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-pine-100 text-xs uppercase text-ink/50">
          <tr>
            <th className="p-4">Order</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-pine-50 last:border-0">
              <td className="p-4 font-medium text-ink">#{o._id.slice(-8).toUpperCase()}</td>
              <td className="p-4 text-ink/70">{o.user?.name} <br /><span className="text-xs text-ink/40">{o.user?.email}</span></td>
              <td className="p-4 text-ink/70">{CURRENCY}{o.totalPrice}</td>
              <td className="p-4">
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  className="input-field w-auto !py-2 text-xs"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
