import api from "./api";

const jugadorService = {
  getAll: async () => {
    const response = await api.get("/jugadores/");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/jugadores/${id}`);
    return response.data;
  },

  create: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        if (key === "devolucion1" || key === "devolucion2" || key === "devolucion3" || key === "devoluciones") {
          if (data[key] instanceof File) formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    const response = await api.post("/jugadores/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        if (key === "devolucion1" || key === "devolucion2" || key === "devolucion3" || key === "devoluciones") {
          if (data[key] instanceof File) formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    const response = await api.put(`/jugadores/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/jugadores/${id}`);
  },
};

export default jugadorService;
