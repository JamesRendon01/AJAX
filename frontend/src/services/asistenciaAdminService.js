import api from "./api";

const asistenciaService = {
  getAll: async () => {
    const response = await api.get("/asistencias/");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/asistencias/${id}`);
    return response.data;
  },

  create: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    const response = await api.post("/asistencias/", formData, {
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
    const response = await api.put(`/asistencias/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/asistencias/${id}`);
  },
};

export default asistenciaService;