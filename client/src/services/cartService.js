import api from "./api";

export const fetchCart = async () => (await api.get("/cart")).data.data.cart;
export const addItemToCart = async (payload) => (await api.post("/cart", payload)).data.data.cart;
export const updateItemQuantity = async (itemId, quantity) =>
  (await api.put(`/cart/${itemId}`, { quantity })).data.data.cart;
export const removeItem = async (itemId) => (await api.delete(`/cart/${itemId}`)).data.data.cart;
export const clearCartApi = async () => (await api.delete("/cart")).data.data.cart;
