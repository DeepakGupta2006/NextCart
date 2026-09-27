import api from "./api";

export const fetchAddresses = async () => (await api.get("/addresses")).data.data.addresses;
export const addAddressApi = async (payload) => (await api.post("/addresses", payload)).data.data.addresses;
export const updateAddressApi = async (id, payload) =>
  (await api.put(`/addresses/${id}`, payload)).data.data.addresses;
export const deleteAddressApi = async (id) => (await api.delete(`/addresses/${id}`)).data.data.addresses;
