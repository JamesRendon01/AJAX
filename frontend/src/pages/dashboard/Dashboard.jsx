import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";        // ✅ corregido 'layaut' → 'layout'
import dashboardService from "../../services/dashboardService";

const StatCard = ({ label, value }) => (
  <div className="bg-[#2d2d2d] rounded-xl p-4">
    <p className="text-gray-400 text-sm leading-snug mb-2">{label}</p>
    <p className="text-blue-500 text-3xl font-medium">{value}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [entrenadores, setEntrenadores] = useState([]);
  const [jugadoresCat, setJugadoresCat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const [s, e, j] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getEntrenadores(3),
        dashboardService.getJugadoresPorCategoria(),
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
    <div className="flex min-h-screen items-center justify-center bg-gray-200">
      <p className="text-gray-500 text-sm">Cargando...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="bg-white px-6 py-4 flex justify-between items-start border-b border-gray-200">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Bienvenido, resumen general del sistema</p>
          </div>
          <p className="text-sm text-gray-500 capitalize">{fecha}</p>
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1">
          {/* Tarjetas estadísticas */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <StatCard label="Total entrenadores" value={stats.entrenadores} />
            <StatCard label="Total jugadores" value={stats.jugadores} />
            <StatCard label="Categorías activas" value={stats.categorias} />
            <StatCard label="Planeaciones este mes" value={stats.planeaciones} />
          </div>

          {/* Paneles inferiores */}
          <div className="grid grid-cols-2 gap-4">
            {/* Jugadores por categoría */}
            <div className="bg-[#2d2d2d] rounded-xl p-5">
              <h2 className="text-white font-medium mb-4">Jugadores por categoría</h2>
              {jugadoresCat.map((cat) => (
                <div key={cat.id} className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-gray-400 text-sm">{cat.nombre}</span>
                    <span className="text-gray-400 text-sm">{cat.jugadores}</span>
                  </div>
                  <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(cat.jugadores / maxJugadores) * 100}%`,
                        background: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Entrenadores */}
            <div className="bg-[#2d2d2d] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-medium">Entrenadores</h2>
                <button className="text-blue-400 text-sm hover:text-blue-300">Ver todos</button>
              </div>
              {entrenadores.map((e) => (
                <div key={e.id} className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3b5e8c] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {e.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{e.nombre}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{e.categoria} · {e.anio}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    e.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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