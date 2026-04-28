import { useEffect, useState } from "react";
import SidebarEntrenador from "../../components/layout/SidebarEntrenador";
import { mockJugadores, mockEntrenadorActual } from "../../mock/data";

export default function MisJugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [nacFiltro, setNacFiltro] = useState("todas");

  useEffect(() => {
    setTimeout(() => {
      const misJugadores = mockJugadores.filter((j) => j.entrenador === mockEntrenadorActual.nombre);
      setJugadores(misJugadores);
    }, 300);
  }, []);

  const filtrados = jugadores.filter((j) => {
    const matchEstado = estadoFiltro === "todos" || j.estado === estadoFiltro;
    const matchNac = nacFiltro === "todas" || j.nacionalidad === nacFiltro;
    return matchEstado && matchNac;
  });

  const activos = jugadores.filter((j) => j.estado === "activo").length;
  const inactivos = jugadores.filter((j) => j.estado === "inactivo").length;

  return (
    <div className="flex min-h-screen bg-gray-200">
      <SidebarEntrenador />
      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Mis Deportistas</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Categoría {mockEntrenadorActual.categoria} · {mockEntrenadorActual.nombre}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-sm px-4 py-2.5 rounded-lg transition-colors">
              Exportar
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
              + Agregar
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total equipo</p>
              <p className="text-blue-500 text-3xl font-medium">{jugadores.length}</p>
            </div>
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Activos</p>
              <p className="text-green-400 text-3xl font-medium">{activos}</p>
            </div>
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Inactivos</p>
              <p className="text-red-400 text-3xl font-medium">{inactivos}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 bg-[#2d2d2d] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            </div>
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}
              className="bg-[#2d2d2d] text-gray-300 text-sm px-4 py-2.5 rounded-lg focus:outline-none flex-1">
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <select value={nacFiltro} onChange={(e) => setNacFiltro(e.target.value)}
              className="bg-[#2d2d2d] text-gray-300 text-sm px-4 py-2.5 rounded-lg focus:outline-none flex-1">
              <option value="todas">Todas las nacionalidades</option>
              <option value="Colombiana">Colombiana</option>
              <option value="Venezolana">Venezolana</option>
            </select>
          </div>

          {/* Tabla */}
          <div className="bg-[#2d2d2d] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  {["Nombre", "Documento", "Nacionalidad", "Dorsal", "F. Ingreso", "Estado", "Acciones"].map((h) => (
                    <th key={h} className="text-gray-400 text-sm font-normal text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((j) => (
                  <tr key={j.id} className="border-b border-gray-700 last:border-0">
                    <td className="text-white text-sm px-4 py-4 font-medium">{j.nombre}</td>
                    <td className="text-gray-300 text-sm px-4 py-4">{j.documento}</td>
                    <td className="text-gray-300 text-sm px-4 py-4">{j.nacionalidad}</td>
                    <td className="text-gray-300 text-sm px-4 py-4">{j.dorsal}</td>
                    <td className="text-gray-300 text-sm px-4 py-4">{j.fechaIngreso}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${j.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {j.estado === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                      <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-xs px-3 py-1.5 rounded-md">Ver</button>
                      <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-xs px-3 py-1.5 rounded-md">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-gray-500 text-sm px-4 py-3">Mostrando {filtrados.length} de {jugadores.length} deportistas</p>
          </div>
        </div>
      </div>
    </div>
  );
}