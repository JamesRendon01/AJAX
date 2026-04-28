import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { mockCategorias } from "../../mock/data";

const colorBadge = {
  Rojo: "bg-red-100 text-red-700",
  Azul: "bg-blue-100 text-blue-700",
  Blanco: "bg-gray-200 text-gray-700",
};

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState("todos");

  useEffect(() => {
    setTimeout(() => setCategorias(mockCategorias), 300);
  }, []);

  const anios = ["todos", ...new Set(mockCategorias.map((c) => c.anio))];
  const filtradas = anioFiltro === "todos"
    ? categorias
    : categorias.filter((c) => c.anio === Number(anioFiltro));

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">

        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Gestión de Categorías</h1>
            <p className="text-sm text-gray-500 mt-0.5">Administra las categorías por año y entrenador</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            + Nueva categoría
          </button>
        </div>

        <div className="p-6">
          {/* Filtros */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 bg-[#2d2d2d] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            </div>
            <select
              value={anioFiltro}
              onChange={(e) => setAnioFiltro(e.target.value)}
              className="bg-[#2d2d2d] text-gray-300 text-sm px-4 py-2.5 rounded-lg focus:outline-none flex-1 max-w-xs"
            >
              <option value="todos">Todos los años</option>
              {anios.filter((a) => a !== "todos").map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <select className="bg-[#2d2d2d] text-gray-300 text-sm px-4 py-2.5 rounded-lg focus:outline-none flex-1 max-w-xs">
              <option>Todas las categorías</option>
            </select>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-4">
            {filtradas.map((cat) => (
              <div key={cat.id} className="bg-[#2d2d2d] rounded-xl p-5">
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${colorBadge[cat.color]} border-current mb-3 inline-block`}>
                  {cat.color}
                </span>
                <h3 className="text-white text-lg font-medium leading-tight">{cat.nombre}</h3>
                <p className="text-gray-400 text-sm mt-1 mb-4">Año: {cat.anio}</p>
                <div className="border-t border-gray-600 pt-4 mb-4">
                  <p className="text-gray-500 text-xs">Entrenador</p>
                  <p className="text-white text-sm font-medium mt-1">{cat.entrenador}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-sm px-4 py-2 rounded-lg transition-colors">
                    Editar
                  </button>
                  <button className="bg-transparent hover:bg-red-900/20 border border-red-500 text-red-400 text-sm px-4 py-2 rounded-lg transition-colors">
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