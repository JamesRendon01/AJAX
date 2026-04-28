import { mockEntrenadorActual, mockAsistencias, mockPlaneaciones } from "../../mock/data";
import SidebarEntrenador from "../../components/layout/SidebarEntrenador";

export default function DashboardEntrenador() {
  const e = mockEntrenadorActual;
  const fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex min-h-screen bg-gray-200">
      <SidebarEntrenador />
      <div className="flex-1 flex flex-col">

        <div className="bg-white px-6 py-4 flex justify-between items-start border-b border-gray-200">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Bienvenido, {e.nombre.split(" ")[0]}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Resumen de tu actividad</p>
          </div>
          <p className="text-sm text-gray-500 capitalize">{fecha}</p>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">Mi categoría</p>
              <p className="text-blue-500 text-2xl font-medium">{e.categoria}</p>
            </div>
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">Total jugadores</p>
              <p className="text-blue-500 text-3xl font-medium">{e.jugadores}</p>
            </div>
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">Planeaciones este mes</p>
              <p className="text-blue-500 text-3xl font-medium">{e.planeacionesMes}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Asistencias */}
            <div className="bg-[#2d2d2d] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-medium">Últimas asistencias</h2>
                <button className="text-blue-400 text-sm">Ver todas</button>
              </div>
              {mockAsistencias.map((a) => (
                <div key={a.id} className="flex items-center justify-between mb-3 last:mb-0">
                  <div>
                    <p className="text-white text-sm font-medium">{a.nombre}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Cargado: {a.fecha}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">Subido</span>
                </div>
              ))}
            </div>

            {/* Planeaciones */}
            <div className="bg-[#2d2d2d] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-medium">Últimas planeaciones</h2>
                <button className="text-blue-400 text-sm">Ver todas</button>
              </div>
              {mockPlaneaciones.map((p) => (
                <div key={p.id} className="flex items-center justify-between mb-3 last:mb-0">
                  <div>
                    <p className="text-white text-sm font-medium">{p.nombre}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{p.inicio} — {p.fin}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    p.estado === "activa"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {p.estado === "activa" ? "Activa" : "Finalizada"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}