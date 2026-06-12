import { mockStats, mockEntrenadores, mockGrupos } from "../mock/data";

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

  getJugadoresPorGrupo: async () => {
    await delay();
    return mockGrupos;
  },
};

export default dashboardService;
