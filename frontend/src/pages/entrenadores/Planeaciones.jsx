import { useState } from "react";
import SidebarEntrenador from "../../components/layout/SidebarEntrenador";
import { mockPlaneaciones } from "../../mock/data";

export default function Planeaciones() {
  const [filtro, setFiltro] = useState("todas");

  const filtradas = filtro === "todas"
    ? mockPlaneaciones
    : mockPlaneaciones.filter((p) => p.estado === filtro);

  return (
    <div className="flex min-h-screen bg-gray-200">
      <SidebarEntrenador />
      <div className="flex-1 flex flex-col">

        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Planeaciones</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestiona las planeaciones de tu categoría</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            + Nueva planeación
          </button>
        </div>

        <div className="p-6">
          {/* Filtro */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 bg-[#2d2d2d] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            </div>
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="bg-[#2d2d2d] text-gray-300 text-sm px-4 py-2.5 rounded-lg focus:outline-none flex-1 max-w-xs"
            >
              <option value="todas">Todas</option>
              <option value="activa">Activas</option>
              <option value="finalizada">Finalizadas</option>
            </select>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4">
            {filtradas.map((p) => (
              <div key={p.id} className={`bg-[#2d2d2d] rounded-xl p-5 ${p.estado === "activa" ? "ring-2 ring-blue-500" : ""}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium text-lg leading-tight">{p.nombre}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ml-2 flex-shrink-0 ${
                    p.estado === "activa"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {p.estado === "activa" ? "Activa" : "Finalizada"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{p.categoria}</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[["Inicio", p.inicio], ["Fin", p.fin], ["Cargado", p.cargado]].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-gray-500 text-xs mb-1">{label}</p>
                      <p className="text-white text-sm font-medium leading-tight">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-sm px-4 py-2 rounded-lg transition-colors">Ver</button>
                  <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-sm px-4 py-2 rounded-lg transition-colors">Editar</button>
                  <button className="bg-transparent hover:bg-red-900/20 border border-red-500 text-red-400 text-sm px-4 py-2 rounded-lg transition-colors">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}