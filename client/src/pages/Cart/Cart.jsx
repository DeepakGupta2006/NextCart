import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import CartItem from "../../components/cart/CartItem";
import { CURRENCY } from "../../utils/constants";

const CartPage = () => {
  const { cart, subtotal } = useCart();
  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className="container-app flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <p className="font-display text-xl text-ink">Your bag is empty</p>
        <p className="text-sm text-ink/60">Find something you'll actually wear.</p>
        <Link to="/shop/men" className="btn-primary">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-app grid gap-10 py-10 md:grid-cols-3">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-semibold text-ink">Your bag</h1>
        <div className="mt-4">
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
      </div>

      <div className="h-fit rounded-lg border border-pine-100 bg-white p-6">
        <p className="font-display text-lg text-ink">Order summary</p>
        <div className="mt-4 flex justify-between text-sm text-ink/70">
          <span>Subtotal</span>
          <span>{CURRENCY}{subtotal}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-ink/70">
          <span>Shipping</span>
          <span>{subtotal > 999 ? "Free" : `${CURRENCY}79`}</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-pine-100 pt-4 text-base font-semibold text-ink">
          <span>Estimated total</span>
          <span>{CURRENCY}{subtotal > 999 ? subtotal : subtotal + 79}</span>
        </div>
        <Link to="/checkout" className="btn-primary mt-6 w-full">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
