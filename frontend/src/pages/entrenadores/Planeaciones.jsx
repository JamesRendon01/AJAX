import { useState } from "react";
import SidebarEntrenador from "../../components/layout/SidebarEntrenador";
import { mockPlaneaciones } from "../../mock/data";

export default function Planeaciones() {
  const [filtro, setFiltro] = useState("todas");

  const filtradas = filtro === "todas"
    ? mockPlaneaciones
    : mockPlaneaciones.filter((p) => p.estado === filtro);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarEntrenador />
      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Planeaciones</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestiona las planeaciones de tu categoría</p>
          </div>
          <button className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
            + Nueva planeación
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-3 mb-6">
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue"
            >
              <option value="todas">Todas</option>
              <option value="activa">Activas</option>
              <option value="finalizada">Finalizadas</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {filtradas.map((p) => (
              <div key={p.id} className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${p.estado === "activa" ? "border-club-blue/30 ring-1 ring-club-blue/20" : "border-gray-100"}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-800 font-bold text-lg leading-tight">{p.nombre}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ml-2 flex-shrink-0 ${
                    p.estado === "activa"
                      ? "bg-blue-50 text-club-blue border-blue-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}>
                    {p.estado === "activa" ? "Activa" : "Finalizada"}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{p.categoria}</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[["Inicio", p.inicio], ["Fin", p.fin], ["Cargado", p.cargado]].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-gray-800 text-sm font-medium leading-tight">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2 rounded-lg transition-colors">Ver</button>
                  <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2 rounded-lg transition-colors">Editar</button>
                  <button className="border border-club-red/30 text-club-red hover:bg-red-50 text-sm px-4 py-2 rounded-lg transition-colors">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
