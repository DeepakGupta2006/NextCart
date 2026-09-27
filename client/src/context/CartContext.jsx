import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { addItemToCart, clearCartApi, fetchCart, removeItem, updateItemQuantity } from "../services/cartService";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart({ items: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      // silently ignore — user likely not logged in
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity, size, color) => {
    if (!user) {
      toast.error("Please sign in to add items to your cart");
      return;
    }
    const data = await addItemToCart({ productId, quantity, size, color });
    setCart(data);
    toast.success("Added to your bag");
  };

  const updateQuantity = async (itemId, quantity) => {
    const data = await updateItemQuantity(itemId, quantity);
    setCart(data);
  };

  const removeFromCart = async (itemId) => {
    const data = await removeItem(itemId);
    setCart(data);
    toast.success("Item removed");
  };

  const clearCart = async () => {
    const data = await clearCartApi();
    setCart(data);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
