import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { mockGrupos } from "../../mock/data";

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

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState("todos");

  useEffect(() => {
    setTimeout(() => setGrupos(mockGrupos), 300);
  }, []);

  const anios = ["todos", ...new Set(mockGrupos.map((c) => c.anio).filter(Boolean))];
  const filtrados = anioFiltro === "todos"
    ? grupos
    : grupos.filter((c) => c.anio === Number(anioFiltro));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Gestión de Grupos</h1>
            <p className="text-sm text-gray-500 mt-0.5">Administra los grupos del club</p>
          </div>
          <button className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
            + Nuevo grupo
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
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
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2 rounded-lg transition-colors">
                    Editar
                  </button>
                  <button className="border border-club-red/30 text-club-red hover:bg-red-50 text-sm px-4 py-2 rounded-lg transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
