import { CURRENCY } from "../../utils/constants";
import { useCart } from "../../hooks/useCart";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 border-b border-pine-100 py-5">
      <div className="h-24 w-20 flex-shrink-0 rounded-md bg-pine-50">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full rounded-md object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-pine-300">
            {item.name}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-ink">{item.name}</p>
          <p className="mt-1 text-xs text-ink/50">
            {item.size && `Size: ${item.size}`} {item.color && ` · Color: ${item.color}`}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-md border border-pine-100">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
              className="px-3 py-1 text-pine-500"
            >
              −
            </button>
            <span className="text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
              className="px-3 py-1 text-pine-500"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-pine-500">
            {CURRENCY}{item.price * item.quantity}
          </span>
        </div>
      </div>

      <button onClick={() => removeFromCart(item._id)} className="self-start text-xs text-coral-600 hover:underline">
        Remove
      </button>
    </div>
  );
};

export default CartItem;
