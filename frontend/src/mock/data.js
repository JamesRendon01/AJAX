export const mockStats = {
  entrenadores: 12,
  jugadores: 248,
  grupos: 9,
  planeaciones: 34,
};

export const mockEntrenadores = [
  { id: 1, initials: "CG", nombre: "Carlos García", grupo: "GRUPO ROJO", anio: 2025, activo: true },
  { id: 2, initials: "ML", nombre: "María López", grupo: "GRUPO AZUL", anio: 2025, activo: true },
  { id: 3, initials: "JP", nombre: "Juan Pérez", grupo: "GRUPO BLANCO", anio: 2025, activo: false },
  { id: 4, initials: "AR", nombre: "Andrea Ruiz", grupo: "GRUPO ROJO", anio: 2025, activo: true },
  { id: 5, initials: "LM", nombre: "Luis Martínez", grupo: "GRUPO AZUL", anio: 2025, activo: true },
];


export const mockGrupos = [
  { id: 1, nombre: "GRUPO ROJO", jugadores: 89, color: "#ef4444", activo: true, lapsoDevolucionesInicio: "01 Jun 2026", lapsoDevolucionesFin: "30 Jun 2026" },
  { id: 2, nombre: "GRUPO AZUL", jugadores: 76, color: "#3b82f6", activo: true, lapsoDevolucionesInicio: null, lapsoDevolucionesFin: null },
  { id: 3, nombre: "GRUPO BLANCO A", jugadores: 83, color: "#9ca3af", activo: true, lapsoDevolucionesInicio: null, lapsoDevolucionesFin: null },
  { id: 4, nombre: "GRUPO BLANCO B", jugadores: 45, color: "#d1d5db", activo: true, lapsoDevolucionesInicio: null, lapsoDevolucionesFin: null },
];

export const mockUsuario = {
  nombre: "Administrador",
  initials: "AD",
  rol: "admin",
  username: "admin",
  password: "1234",
};

export const mockAsistencias = [
  { id: 1, nombre: "Asistencia semana 10", grupo: "ROJO 2025", fecha: "10 Mar 2026", estado: "subido" },
  { id: 2, nombre: "Asistencia semana 9", grupo: "ROJO 2025", fecha: "03 Mar 2026", estado: "subido" },
  { id: 3, nombre: "Asistencia semana 8", grupo: "ROJO 2025", fecha: "24 Feb 2026", estado: "subido" },
];

export const mockPlaneaciones = [
  { id: 1, nombre: "Planeación marzo 2026", grupo: "GRUPO ROJO 2025", inicio: "01 Mar 2026", fin: "31 Mar 2026", cargado: "28 Feb 2026", estado: "activa" },
  { id: 2, nombre: "Planeación febrero 2026", grupo: "GRUPO ROJO 2025", inicio: "01 Feb 2026", fin: "28 Feb 2026", cargado: "31 Ene 2026", estado: "finalizada" },
  { id: 3, nombre: "Planeación enero 2026", grupo: "GRUPO ROJO 2025", inicio: "01 Ene 2026", fin: "31 Ene 2026", cargado: "29 Dic 2025", estado: "finalizada" },
];

export const mockEntrenadorActual = {
  nombre: "Carlos García",
  initials: "CG",
  grupo: "ROJO 2025",
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
  { id: 1, nombre: "Andrés Martínez", documento: "102345678", grupo: "ROJO", anio: 2025, entrenador: "Carlos García", dorsal: 10, estado: "activo", nacionalidad: "Colombiana", fechaIngreso: "15 Ene 2025",
    devolucion1: "dev1_andres.pdf", devolucion1_fechaInicio: "01 Mar 2026", devolucion1_fechaFin: "15 Mar 2026",
    devolucion2: null, devolucion2_fechaInicio: null, devolucion2_fechaFin: null,
    devolucion3: null, devolucion3_fechaInicio: null, devolucion3_fechaFin: null,
    devoluciones: "/uploads/devoluciones/dev_andres.pdf" },
  { id: 2, nombre: "Luis Rodríguez", documento: "103456789", grupo: "AZUL", anio: 2025, entrenador: "María López", dorsal: 7, estado: "activo", nacionalidad: "Colombiana", fechaIngreso: "18 Ene 2025",
    devolucion1: "dev1_luis.pdf", devolucion1_fechaInicio: "10 Feb 2026", devolucion1_fechaFin: "28 Feb 2026",
    devolucion2: "dev2_luis.pdf", devolucion2_fechaInicio: "01 Abr 2026", devolucion2_fechaFin: "15 Abr 2026",
    devolucion3: null, devolucion3_fechaInicio: null, devolucion3_fechaFin: null,
    devoluciones: null },
  { id: 3, nombre: "Pedro Sánchez", documento: "104567890", grupo: "BLANCO", anio: 2025, entrenador: "Juan Pérez", dorsal: 3, estado: "inactivo", nacionalidad: "Venezolana", fechaIngreso: "05 Feb 2025",
    devolucion1: null, devolucion1_fechaInicio: null, devolucion1_fechaFin: null,
    devolucion2: null, devolucion2_fechaInicio: null, devolucion2_fechaFin: null,
    devolucion3: null, devolucion3_fechaInicio: null, devolucion3_fechaFin: null,
    devoluciones: null },
  { id: 4, nombre: "Santiago Torres", documento: "105678901", grupo: "ROJO", anio: 2025, entrenador: "Carlos García", dorsal: 5, estado: "activo", nacionalidad: "Colombiana", fechaIngreso: "20 Ene 2025",
    devolucion1: "dev1_santiago.pdf", devolucion1_fechaInicio: "05 Ene 2026", devolucion1_fechaFin: "20 Ene 2026",
    devolucion2: "dev2_santiago.pdf", devolucion2_fechaInicio: "01 Mar 2026", devolucion2_fechaFin: "15 Mar 2026",
    devolucion3: "dev3_santiago.pdf", devolucion3_fechaInicio: "01 May 2026", devolucion3_fechaFin: "15 May 2026",
    devoluciones: "/uploads/devoluciones/dev_santiago.pdf" },
  { id: 5, nombre: "Miguel Herrera", documento: "106789012", grupo: "ROJO", anio: 2025, entrenador: "Carlos García", dorsal: 2, estado: "activo", nacionalidad: "Colombiana", fechaIngreso: "10 Feb 2025",
    devolucion1: "dev1_miguel.pdf", devolucion1_fechaInicio: "20 Mar 2026", devolucion1_fechaFin: "05 Abr 2026",
    devolucion2: null, devolucion2_fechaInicio: null, devolucion2_fechaFin: null,
    devolucion3: null, devolucion3_fechaInicio: null, devolucion3_fechaFin: null,
    devoluciones: null },
];  
