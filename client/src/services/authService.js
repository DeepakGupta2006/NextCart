import api from "./api";

export const registerUser = async (payload) => (await api.post("/auth/register", payload)).data.data;
export const loginUser = async (payload) => (await api.post("/auth/login", payload)).data.data;
export const fetchMe = async () => (await api.get("/auth/me")).data.data;
export const updateProfile = async (payload) => (await api.put("/auth/me", payload)).data.data;
