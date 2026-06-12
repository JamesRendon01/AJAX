import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import SidebarCoordinador from "../../components/layout/SidebarCoordinador";
import authService from "../../services/authService";
import { mockJugadores } from "../../mock/data";
import usePageTitle from "../../hooks/usePageTitle";

const grupoColor = { ROJO: "bg-red-50 text-red-700 border-red-200", AZUL: "bg-blue-50 text-blue-700 border-blue-200", BLANCO: "bg-gray-100 text-gray-600 border-gray-200" };

function getBadgeColor(grupo) {
  return grupoColor[grupo] || "bg-gray-100 text-gray-600 border-gray-200";
}

export default function Jugadores() {
  usePageTitle("Jugadores");
  const [jugadores, setJugadores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [grupoFiltro, setGrupoFiltro] = useState("todas");
  const [anioFiltro, setAnioFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [detalleId, setDetalleId] = useState(null);
  const rol = authService.getRol();

  useEffect(() => {
    setTimeout(() => setJugadores(mockJugadores), 300);
  }, []);

  const filtrados = jugadores.filter((j) => {
    const matchBusqueda = j.nombre.toLowerCase().includes(busqueda.toLowerCase()) || j.documento.includes(busqueda);
    const matchGrupo = grupoFiltro === "todas" || j.grupo === grupoFiltro;
    const matchAnio = anioFiltro === "todos" || j.anio === Number(anioFiltro);
    const matchEstado = estadoFiltro === "todos" || j.estado === estadoFiltro;
    return matchBusqueda && matchGrupo && matchAnio && matchEstado;
  });

  const total = jugadores.length;
  const porGrupo = (g) => jugadores.filter((j) => j.grupo === g).length;

  const devolucionesCount = (j) => {
    let count = 0;
    if (j.devolucion1) count++;
    if (j.devolucion2) count++;
    if (j.devolucion3) count++;
    return count;
  };

  return (
    <div className="flex min-h-screen bg-club-dark">
      {rol === "coordinador" ? <SidebarCoordinador /> : <Sidebar />}
      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Deportistas</h1>
            <p className="text-sm text-gray-500 mt-0.5">Lista general de todos los deportistas del club</p>
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

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Total</p>
              <p className="text-club-blue text-3xl font-bold">{total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Grupo Rojo</p>
              <p className="text-club-red text-3xl font-bold">{porGrupo("ROJO")}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Grupo Azul</p>
              <p className="text-club-blue text-3xl font-bold">{porGrupo("AZUL")}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Grupo Blanco</p>
              <p className="text-gray-600 text-3xl font-bold">{porGrupo("BLANCO")}</p>
            </div>
          </div>

          <input type="text" placeholder="Buscar por nombre o documento..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent" />

          <div className="grid grid-cols-3 gap-3 mb-6">
            <select value={grupoFiltro} onChange={(e) => setGrupoFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue">
              <option value="todas">Todos los grupos</option>
              <option value="ROJO">GRUPO ROJO</option>
              <option value="AZUL">GRUPO AZUL</option>
              <option value="BLANCO">GRUPO BLANCO</option>
            </select>
            <select value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue">
              <option value="todos">Todos los años</option>
              <option value="2025">2025</option>
            </select>
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue">
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Nombre", "Documento", "Grupo", "Entrenador", "Dorsal", "Estado", "Devoluciones", "Acciones"].map((h) => (
                    <th key={h} className="text-gray-600 text-sm font-semibold text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((j, i) => (
                  <tr key={j.id} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="text-gray-800 text-sm px-4 py-4 font-medium">{j.nombre}</td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.documento}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getBadgeColor(j.grupo)}`}>
                        GRUPO {j.grupo}<br/>{j.anio}
                      </span>
                    </td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.entrenador}</td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.dorsal}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        j.estado === "activo"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {j.estado === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setDetalleId(detalleId === j.id ? null : j.id)}
                        className="text-club-blue text-xs font-medium hover:underline"
                      >
                        {devolucionesCount(j)} devolucione{devolucionesCount(j) !== 1 ? "s" : ""}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs px-3 py-1.5 rounded-md transition-colors mr-1">Ver</button>
                      <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs px-3 py-1.5 rounded-md transition-colors">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-gray-400 text-sm px-4 py-3 border-t border-gray-100">Mostrando {filtrados.length} de {total} deportistas</p>
          </div>
        </div>

        {detalleId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDetalleId(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-club-blue">Devoluciones - {jugadores.find((j) => j.id === detalleId)?.nombre}</h2>
                <button onClick={() => setDetalleId(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((n) => {
                  const j = jugadores.find((j) => j.id === detalleId);
                  const key = `devolucion${n}`;
                  if (!j[key]) return (
                    <div key={n} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                      <p className="text-sm font-medium text-gray-500 mb-1">Devolución {n}</p>
                      <p className="text-xs text-gray-400">Sin registro</p>
                    </div>
                  );
                  return (
                    <div key={n} className="border border-gray-100 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Devolución {n}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Inicio: <strong className="text-gray-700">{j[`${key}_fechaInicio`]}</strong></span>
                        <span>Fin: <strong className="text-gray-700">{j[`${key}_fechaFin`]}</strong></span>
                        <a href={j[key]} target="_blank" rel="noopener noreferrer" className="text-club-blue font-medium hover:underline">Ver archivo</a>
                      </div>
                    </div>
                  );
                })}
                {(() => {
                  const j = jugadores.find((j) => j.id === detalleId);
                  return (
                    <div className={`border rounded-lg p-4 ${j.devoluciones ? "border-gray-100" : "border-gray-100 bg-gray-50"}`}>
                      <p className="text-sm font-medium text-gray-700 mb-2">Documento Devoluciones</p>
                      {j.devoluciones ? (
                        <a href={j.devoluciones} target="_blank" rel="noopener noreferrer" className="text-club-blue text-xs font-medium hover:underline">
                          Ver archivo
                        </a>
                      ) : (
                        <p className="text-xs text-gray-400">Sin archivo</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
