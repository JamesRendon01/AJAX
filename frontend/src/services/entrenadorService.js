import { mockEntrenadores } from "../mock/data";

let entrenadores = [...mockEntrenadores];
const delay = () => new Promise((r) => setTimeout(r, 300));

const entrenadorService = {
  getAll: async () => { await delay(); return entrenadores; },
  getById: async (id) => { await delay(); return entrenadores.find((e) => e.id === id); },
  create: async (data) => {
    await delay();
    const nuevo = { ...data, id: Date.now(), initials: data.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() };
    entrenadores.push(nuevo);
    return nuevo;
  },
  update: async (id, data) => {
    await delay();
    entrenadores = entrenadores.map((e) => e.id === id ? { ...e, ...data } : e);
    return entrenadores.find((e) => e.id === id);
  },
};

export default entrenadorService;