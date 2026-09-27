import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { placeOrder } from "../../services/orderService";
import { createRazorpayOrder, loadRazorpayScript } from "../../services/paymentService";
import { CURRENCY } from "../../utils/constants";

const emptyAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const Checkout = () => {
  const { user } = useAuth();
  const { cart, subtotal, refreshCart } = useCart();
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const finishOrder = async (paymentResult) => {
    const order = await placeOrder({ shippingAddress: address, paymentMethod, paymentResult });
    await refreshCart();
    toast.success("Order placed successfully");
    navigate(`/order-success/${order._id}`);
  };

  const payWithRazorpay = async () => {
    await loadRazorpayScript();
    const { orderId, amount, currency, keyId } = await createRazorpayOrder();

    return new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "NextCart",
        description: "Order payment",
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#0F3D3E" },
        handler: (response) => {
          // response contains razorpay_order_id, razorpay_payment_id, razorpay_signature
          resolve(response);
        },
        modal: {
          ondismiss: () => reject(new Error("Payment was cancelled")),
        },
      });
      razorpay.on("payment.failed", () => reject(new Error("Payment failed — please try again")));
      razorpay.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (paymentMethod === "razorpay") {
        const response = await payWithRazorpay();
        await finishOrder({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      } else {
        await finishOrder(undefined);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const shipping = subtotal > 999 ? 0 : 79;
  const tax = Math.round(subtotal * 0.05);

  return (
    <div className="container-app grid gap-10 py-10 md:grid-cols-3">
      <form onSubmit={handleSubmit} className="md:col-span-2">
        <h1 className="text-2xl font-semibold text-ink">Checkout</h1>

        <p className="mt-6 text-sm font-semibold text-pine-500">Shipping address</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <input required name="fullName" placeholder="Full name" value={address.fullName} onChange={handleChange} className="input-field" />
          <input required name="phone" placeholder="Phone number" value={address.phone} onChange={handleChange} className="input-field" />
          <input required name="line1" placeholder="Address line 1" value={address.line1} onChange={handleChange} className="input-field sm:col-span-2" />
          <input name="line2" placeholder="Address line 2 (optional)" value={address.line2} onChange={handleChange} className="input-field sm:col-span-2" />
          <input required name="city" placeholder="City" value={address.city} onChange={handleChange} className="input-field" />
          <input required name="state" placeholder="State" value={address.state} onChange={handleChange} className="input-field" />
          <input required name="postalCode" placeholder="Postal code" value={address.postalCode} onChange={handleChange} className="input-field" />
          <input required name="country" placeholder="Country" value={address.country} onChange={handleChange} className="input-field" />
        </div>

        <p className="mt-8 text-sm font-semibold text-pine-500">Payment method</p>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod("cod")}
            className={`rounded-md border px-4 py-3 text-sm font-medium ${
              paymentMethod === "cod" ? "border-pine-500 bg-pine-50 text-pine-500" : "border-pine-100 text-ink/70"
            }`}
          >
            Cash on delivery
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("razorpay")}
            className={`rounded-md border px-4 py-3 text-sm font-medium ${
              paymentMethod === "razorpay" ? "border-pine-500 bg-pine-50 text-pine-500" : "border-pine-100 text-ink/70"
            }`}
          >
            Pay online (Razorpay)
          </button>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-8 w-full md:w-auto">
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>

      <div className="h-fit rounded-lg border border-pine-100 bg-white p-6">
        <p className="font-display text-lg text-ink">Order summary</p>
        {(cart.items || []).map((item) => (
          <div key={item._id} className="mt-3 flex justify-between text-sm text-ink/70">
            <span>{item.name} × {item.quantity}</span>
            <span>{CURRENCY}{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="mt-4 space-y-1 border-t border-pine-100 pt-4 text-sm text-ink/70">
          <div className="flex justify-between"><span>Subtotal</span><span>{CURRENCY}{subtotal}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `${CURRENCY}${shipping}`}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>{CURRENCY}{tax}</span></div>
        </div>
        <div className="mt-3 flex justify-between border-t border-pine-100 pt-3 text-base font-semibold text-ink">
          <span>Total</span>
          <span>{CURRENCY}{subtotal + shipping + tax}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;