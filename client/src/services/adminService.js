import api from "./api";

export const fetchUsers = async () => (await api.get("/users")).data.data.users;
export const toggleUserStatusApi = async (id) => (await api.put(`/users/${id}/status`)).data.data.user;
