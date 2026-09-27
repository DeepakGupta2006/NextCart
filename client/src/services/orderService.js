import api from "./api";

export const placeOrder = async (payload) => (await api.post("/orders", payload)).data.data.order;
export const fetchMyOrders = async () => (await api.get("/orders/mine")).data.data.orders;
export const fetchOrder = async (id) => (await api.get(`/orders/${id}`)).data.data.order;
export const fetchAllOrders = async () => (await api.get("/orders")).data.data.orders;
export const updateOrderStatusApi = async (id, status) =>
  (await api.put(`/orders/${id}/status`, { status })).data.data.order;
