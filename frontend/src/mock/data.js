export const mockStats = {
  entrenadores: 12,
  jugadores: 248,
  categorias: 9,
  planeaciones: 34,
};

export const mockEntrenadores = [
  { id: 1, initials: "CG", nombre: "Carlos García", categoria: "Categoría Rojo", anio: 2025, activo: true },
  { id: 2, initials: "ML", nombre: "María López", categoria: "Categoría Azul", anio: 2025, activo: true },
  { id: 3, initials: "JP", nombre: "Juan Pérez", categoria: "Categoría Blanco", anio: 2025, activo: false },
  { id: 4, initials: "AR", nombre: "Andrea Ruiz", categoria: "Categoría Rojo", anio: 2025, activo: true },
  { id: 5, initials: "LM", nombre: "Luis Martínez", categoria: "Categoría Azul", anio: 2025, activo: true },
];


export const mockCategorias = [
  { id: 1, nombre: "Categoría Rojo", jugadores: 89, color: "#ef4444", activo: true },
  { id: 2, nombre: "Categoría Azul", jugadores: 76, color: "#3b82f6", activo: true },
  { id: 3, nombre: "Categoría Blanco", jugadores: 83, color: "#9ca3af", activo: true },
];

export const mockUsuario = {
  nombre: "Administrador",
  initials: "AD",
  rol: "admin",
  username: "admin",
  password: "1234",
};

export const mockAsistencias = [
  { id: 1, nombre: "Asistencia semana 10", categoria: "Rojo 2025", fecha: "10 Mar 2026", estado: "subido" },
  { id: 2, nombre: "Asistencia semana 9", categoria: "Rojo 2025", fecha: "03 Mar 2026", estado: "subido" },
  { id: 3, nombre: "Asistencia semana 8", categoria: "Rojo 2025", fecha: "24 Feb 2026", estado: "subido" },
];

export const mockPlaneaciones = [
  { id: 1, nombre: "Planeación marzo 2026", categoria: "Categoría Rojo 2025", inicio: "01 Mar 2026", fin: "31 Mar 2026", cargado: "28 Feb 2026", estado: "activa" },
  { id: 2, nombre: "Planeación febrero 2026", categoria: "Categoría Rojo 2025", inicio: "01 Feb 2026", fin: "28 Feb 2026", cargado: "31 Ene 2026", estado: "finalizada" },
  { id: 3, nombre: "Planeación enero 2026", categoria: "Categoría Rojo 2025", inicio: "01 Ene 2026", fin: "31 Ene 2026", cargado: "29 Dic 2025", estado: "finalizada" },
];

export const mockEntrenadorActual = {
  nombre: "Carlos García",
  initials: "CG",
  categoria: "Rojo 2025",
  jugadores: 89,
  planeacionesMes: 8,
};

export const mockUsuarios = [
  {
    id: 1,
    nombre: "Administrador",
    initials: "AD",
    rol: "admin",
    username: "admin",
    password: "1234",
  },
  {
    id: 2,
    nombre: "Carlos García",
    initials: "CG",
    rol: "entrenador",
    username: "carlos",
    password: "1234",
  },
];

export const mockJugadores = [
  { id: 1, nombre: "Andrés Martínez", documento: "102345678", categoria: "Rojo", anio: 2025, entrenador: "Carlos García", dorsal: 10, estado: "activo", nacionalidad: "Colombiana", fechaIngreso: "15 Ene 2025" },
  { id: 2, nombre: "Luis Rodríguez", documento: "103456789", categoria: "Azul", anio: 2025, entrenador: "María López", dorsal: 7, estado: "activo", nacionalidad: "Colombiana", fechaIngreso: "18 Ene 2025" },
  { id: 3, nombre: "Pedro Sánchez", documento: "104567890", categoria: "Blanco", anio: 2025, entrenador: "Juan Pérez", dorsal: 3, estado: "inactivo", nacionalidad: "Venezolana", fechaIngreso: "05 Feb 2025" },
  { id: 4, nombre: "Santiago Torres", documento: "105678901", categoria: "Rojo", anio: 2025, entrenador: "Carlos García", dorsal: 5, estado: "activo", nacionalidad: "Colombiana", fechaIngreso: "20 Ene 2025" },
  { id: 5, nombre: "Miguel Herrera", documento: "106789012", categoria: "Rojo", anio: 2025, entrenador: "Carlos García", dorsal: 2, estado: "activo", nacionalidad: "Colombiana", fechaIngreso: "10 Feb 2025" },
];  