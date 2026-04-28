import api from "./api";

const planeacionService = {
  getAll: async () => {
    const response = await api.get("/planeaciones/");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/planeaciones/${id}`);
    return response.data;
  },

  create: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    const response = await api.post("/planeaciones/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    const response = await api.put(`/planeaciones/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/planeaciones/${id}`);
  },
};

export default planeacionService;