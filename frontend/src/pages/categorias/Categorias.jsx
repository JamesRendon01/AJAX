import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { mockCategorias } from "../../mock/data";

const colorMap = {
  Rojo: "bg-red-50 text-red-700 border-red-200",
  Azul: "bg-blue-50 text-blue-700 border-blue-200",
  Blanco: "bg-gray-100 text-gray-600 border-gray-200",
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

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [anioFiltro, setAnioFiltro] = useState("todos");

  useEffect(() => {
    setTimeout(() => setCategorias(mockCategorias), 300);
  }, []);

  const anios = ["todos", ...new Set(mockCategorias.map((c) => c.anio).filter(Boolean))];
  const filtradas = anioFiltro === "todos"
    ? categorias
    : categorias.filter((c) => c.anio === Number(anioFiltro));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Gestión de Categorías</h1>
            <p className="text-sm text-gray-500 mt-0.5">Administra las categorías por año y entrenador</p>
          </div>
          <button className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
            + Nueva categoría
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-3 mb-6">
            <select
              value={anioFiltro}
              onChange={(e) => setAnioFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue"
            >
              <option value="todos">Todos los años</option>
              {anios.filter((a) => a !== "todos").map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {filtradas.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getColorStyle(cat.nombre)}`}>
                    {getColorName(cat.nombre) || "General"}
                  </span>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                </div>
                <h3 className="text-gray-800 text-lg font-bold leading-tight">{cat.nombre}</h3>
                {cat.anio && <p className="text-gray-500 text-sm mt-1 mb-4">Año: {cat.anio}</p>}
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
