import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import SidebarCoordinador from "../../components/layout/SidebarCoordinador";
import authService from "../../services/authService";
import { mockGrupos } from "../../mock/data";
import usePageTitle from "../../hooks/usePageTitle";

const colorMap = {
  ROJO: "bg-red-50 text-red-700 border-red-200",
  AZUL: "bg-blue-50 text-blue-700 border-blue-200",
  BLANCO: "bg-gray-100 text-gray-600 border-gray-200",
};

function getColorStyle(nombre) {
  if (!nombre) return "bg-gray-100 text-gray-600 border-gray-200";
  const key = Object.keys(colorMap).find((k) => nombre.includes(k));
  return colorMap[key] || "bg-gray-100 text-gray-600 border-gray-200";
}

function getColorName(nombre) {
  if (!nombre) return "";
  const key = Object.keys(colorMap).find((k) => nombre.includes(k));
  return key || "";
}

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

export default function Grupos() {
  usePageTitle("Grupos");
  const [grupos, setGrupos] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState("todos");
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({});
  const rol = authService.getRol();
  const esAdminOCoordinador = rol === "admin" || rol === "coordinador";
  const SidebarComponent = rol === "coordinador" ? SidebarCoordinador : Sidebar;

  useEffect(() => {
    setTimeout(() => setGrupos(mockGrupos), 300);
  }, []);

  const anios = ["todos", ...new Set(mockGrupos.map((c) => c.anio).filter(Boolean))];
  const filtrados = anioFiltro === "todos"
    ? grupos
    : grupos.filter((c) => c.anio === Number(anioFiltro));

  const abrirEditar = (g) => {
    setEditandoId(g.id);
    setForm({
      lapsoDevolucionesInicio: g.lapsoDevolucionesInicio || "",
      lapsoDevolucionesFin: g.lapsoDevolucionesFin || "",
    });
  };

  const guardar = () => {
    setGrupos(grupos.map((g) =>
      g.id === editandoId ? { ...g, ...form } : g
    ));
    setEditandoId(null);
  };

  return (
    <div className="flex min-h-screen bg-club-dark">
      <SidebarComponent />
      <div className="flex-1 min-h-screen flex flex-col pt-14 lg:pt-0">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Gestión de Grupos</h1>
            <p className="text-sm text-gray-500 mt-0.5">Administra los grupos del club</p>
          </div>
          {esAdminOCoordinador && (
            <button className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              + Nuevo grupo
            </button>
          )}
        </div>

        <div className="p-4 lg:p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtrados.map((g) => (
              <div key={g.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getColorStyle(g.nombre)}`}>
                    {getColorName(g.nombre) || "General"}
                  </span>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                </div>
                <h3 className="text-gray-800 text-lg font-bold leading-tight">{g.nombre}</h3>
                <p className="text-gray-500 text-sm mt-2 mb-4">{g.jugadores} jugadores</p>

                {g.lapsoDevolucionesInicio && g.lapsoDevolucionesFin && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Lapso devoluciones</p>
                    <p className="text-sm text-club-blue font-medium">
                      {formatDate(g.lapsoDevolucionesInicio)} - {formatDate(g.lapsoDevolucionesFin)}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  {esAdminOCoordinador && (
                    <button onClick={() => abrirEditar(g)} className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2 rounded-lg transition-colors">
                      Editar lapso
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editandoId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditandoId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-club-blue">Lapso de devoluciones</h2>
              <button onClick={() => setEditandoId(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Define el período en que los entrenadores pueden subir el archivo de devoluciones de sus jugadores.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1">Inicio lapso</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={form.lapsoDevolucionesInicio} onChange={(e) => setForm({...form, lapsoDevolucionesInicio: e.target.value})} />
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1">Fin lapso</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={form.lapsoDevolucionesFin} onChange={(e) => setForm({...form, lapsoDevolucionesFin: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditandoId(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={guardar} className="px-4 py-2 text-sm text-white bg-club-blue rounded-lg hover:bg-blue-800 font-medium">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
