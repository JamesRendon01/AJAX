import { mockEntrenadorActual, mockAsistencias, mockPlaneaciones } from "../../mock/data";
import SidebarEntrenador from "../../components/layout/SidebarEntrenador";
import usePageTitle from "../../hooks/usePageTitle";

export default function DashboardEntrenador() {
  usePageTitle("Dashboard Entrenador");
  const e = mockEntrenadorActual;
  const fecha = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex min-h-screen bg-club-dark">
      <SidebarEntrenador />
      <div className="flex-1 min-h-screen flex flex-col pt-14 lg:pt-0">
        <div className="bg-white px-6 py-4 flex justify-between items-start flex-col sm:flex-row border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Bienvenido, {e.nombre.split(" ")[0]}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Resumen de tu actividad</p>
          </div>
          <p className="text-sm text-gray-500 capitalize">{fecha}</p>
        </div>

        <div className="p-4 lg:p-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Mi grupo</p>
              <p className="text-club-blue text-2xl font-bold">{e.grupo}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Total jugadores</p>
              <p className="text-club-red text-3xl font-bold">{e.jugadores}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Planeaciones este mes</p>
              <p className="text-club-blue text-3xl font-bold">{e.planeacionesMes}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-gray-800 font-bold text-lg">Últimas asistencias</h2>
                <button className="text-club-blue text-sm font-medium hover:text-blue-700 transition-colors">Ver todas</button>
              </div>
              {mockAsistencias.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{a.nombre}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Cargado: {a.fecha}</p>
                  </div>
                  <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-3 py-1 rounded-full font-medium">Subido</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-gray-800 font-bold text-lg">Últimas planeaciones</h2>
                <button className="text-club-blue text-sm font-medium hover:text-blue-700 transition-colors">Ver todas</button>
              </div>
              {mockPlaneaciones.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{p.nombre}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{p.inicio} — {p.fin}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                    p.estado === "activa"
                      ? "bg-blue-50 text-club-blue border-blue-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
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
