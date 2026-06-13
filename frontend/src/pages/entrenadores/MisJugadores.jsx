import { useEffect, useState } from "react";
import SidebarEntrenador from "../../components/layout/SidebarEntrenador";
import { mockJugadores, mockEntrenadorActual } from "../../mock/data";
import usePageTitle from "../../hooks/usePageTitle";

export default function MisJugadores() {
  usePageTitle("Mis Jugadores");
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
    <div className="flex min-h-screen bg-club-dark">
      <SidebarEntrenador />
      <div className="flex-1 min-h-screen flex flex-col pt-14 lg:pt-0">
        <div className="bg-white px-6 py-4 flex justify-between items-center flex-col sm:flex-row border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Mis Deportistas</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Grupo {mockEntrenadorActual.grupo} · {mockEntrenadorActual.nombre}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2.5 rounded-lg transition-colors">
              Exportar
            </button>
            <button className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              + Agregar
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Total equipo</p>
              <p className="text-club-blue text-3xl font-bold">{jugadores.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Activos</p>
              <p className="text-green-600 text-3xl font-bold">{activos}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Inactivos</p>
              <p className="text-club-red text-3xl font-bold">{inactivos}</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6 flex-wrap">
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue">
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <select value={nacFiltro} onChange={(e) => setNacFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue">
              <option value="todas">Todas las nacionalidades</option>
              <option value="Colombiana">Colombiana</option>
              <option value="Venezolana">Venezolana</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Nombre", "Documento", "Nacionalidad", "Dorsal", "F. Ingreso", "Estado", "Acciones"].map((h) => (
                    <th key={h} className="text-gray-600 text-sm font-semibold text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((j, i) => (
                  <tr key={j.id} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="text-gray-800 text-sm px-4 py-4 font-medium">{j.nombre}</td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.documento}</td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.nacionalidad}</td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.dorsal}</td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.fechaIngreso}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        j.estado === "activo"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {j.estado === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                      <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs px-3 py-1.5 rounded-md transition-colors">Ver</button>
                      <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs px-3 py-1.5 rounded-md transition-colors">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <p className="text-gray-400 text-sm px-4 py-3 border-t border-gray-100">Mostrando {filtrados.length} de {jugadores.length} deportistas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
