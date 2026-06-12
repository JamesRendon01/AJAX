import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import dashboardService from "../../services/dashboardService";
import usePageTitle from "../../hooks/usePageTitle";

const StatCard = ({ label, value, color = "text-club-blue" }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
    <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default function Dashboard() {
  usePageTitle("Dashboard");
  const [stats, setStats] = useState(null);
  const [entrenadores, setEntrenadores] = useState([]);
  const [jugadoresCat, setJugadoresCat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const [s, e, j] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getEntrenadores(3),
        dashboardService.getJugadoresPorGrupo(),
      ]);
      setStats(s);
      setEntrenadores(e);
      setJugadoresCat(j);
      setLoading(false);
    };
    cargar();
  }, []);

  const fecha = new Date().toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "short", year: "numeric",
  });

  const maxJugadores = jugadoresCat.length
    ? Math.max(...jugadoresCat.map((j) => j.jugadores))
    : 1;

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-club-dark">
      <div className="animate-spin w-8 h-8 border-4 border-club-blue border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-club-dark">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-start border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Bienvenido, resumen general del sistema</p>
          </div>
          <p className="text-sm text-gray-500 capitalize">{fecha}</p>
        </div>

        <div className="p-6 flex-1">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total entrenadores" value={stats.entrenadores} />
            <StatCard label="Total jugadores" value={stats.jugadores} color="text-club-red" />
            <StatCard label="Grupos activos" value={stats.grupos} />
            <StatCard label="Planeaciones este mes" value={stats.planeaciones} color="text-club-red" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-gray-800 font-bold text-lg mb-4">Jugadores por grupo</h2>
              {jugadoresCat.map((g, i) => (
                <div key={g.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-600 text-sm font-medium">{g.nombre}</span>
                    <span className="text-gray-500 text-sm">{g.jugadores}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(g.jugadores / maxJugadores) * 100}%`,
                        background: g.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-gray-800 font-bold text-lg">Entrenadores</h2>
                <button className="text-club-blue text-sm font-medium hover:text-blue-700 transition-colors">Ver todos</button>
              </div>
              {entrenadores.map((e) => (
                <div key={e.id} className="flex items-center gap-3 mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-0 border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-club-blue to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                    {e.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm font-medium">{e.nombre}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{e.grupo} · {e.anio}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    e.activo ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {e.activo ? "Activo" : "Inactivo"}
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
