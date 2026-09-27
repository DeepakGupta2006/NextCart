import api from "./api";

export const fetchProducts = async (params = {}) => (await api.get("/products", { params })).data.data;
export const fetchProduct = async (idOrSlug) => (await api.get(`/products/${idOrSlug}`)).data.data;
export const createProduct = async (payload) => (await api.post("/products", payload)).data.data;
export const updateProduct = async (id, payload) => (await api.put(`/products/${id}`, payload)).data.data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data.data;

// Uploads image files to Cloudinary via our backend and returns their URLs
export const uploadProductImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  const response = await api.post("/products/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data.urls;
};