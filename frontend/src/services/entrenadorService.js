import api from "./api";

const entrenadorService = {
  getAll: async () => {
    const response = await api.get("/entrenadores/");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/entrenadores/${id}`);
    return response.data;
  },

  create: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        const isFile = ["certificado", "delitosSexuales", "tarjetaProfesional"].includes(key);
        if (isFile) {
          if (data[key] instanceof File) formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    const response = await api.post("/entrenadores/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        const isFile = ["certificado", "delitosSexuales", "tarjetaProfesional"].includes(key);
        if (isFile) {
          if (data[key] instanceof File) formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    const response = await api.put(`/entrenadores/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/entrenadores/${id}`);
  },
};

export default entrenadorService;
