import { mockStats, mockEntrenadores, mockCategorias } from "../mock/data";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const dashboardService = {
  getStats: async () => {
    await delay();
    return mockStats;
  },

  getEntrenadores: async (limit = 3) => {
    await delay();
    return mockEntrenadores.slice(0, limit);
  },

  getJugadoresPorCategoria: async () => {
    await delay();
    return mockCategorias;
  },
};

export default dashboardService;