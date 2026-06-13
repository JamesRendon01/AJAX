import { useEffect, useState } from "react";
import SidebarCoordinador from "../../components/layout/SidebarCoordinador";
import api from "../../services/api";
import { Users, Calendar, User } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

export default function DashboardCoordinador() {
  usePageTitle("Dashboard Coordinador");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ent, jug, pla] = await Promise.all([
          api.get("/entrenadores/").then((r) => r.data),
          api.get("/jugadores/").then((r) => r.data),
          api.get("/planeaciones/").then((r) => r.data),
        ]);
        setStats({
          entrenadores: ent.length,
          jugadores: jug.length,
          planeaciones: pla.length,
        });
      } catch {
        setStats({ entrenadores: 0, jugadores: 0, planeaciones: 0 });
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Entrenadores", value: stats?.entrenadores ?? "-", icon: Users, color: "text-club-blue" },
    { label: "Jugadores", value: stats?.jugadores ?? "-", icon: User, color: "text-green-600" },
    { label: "Planeaciones", value: stats?.planeaciones ?? "-", icon: Calendar, color: "text-club-red" },
  ];

  return (
    <div className="flex min-h-screen bg-club-dark">
      <SidebarCoordinador />
      <div className="flex-1 flex flex-col pt-14 lg:pt-0">
        <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
          <h1 className="text-xl font-bold text-club-blue">Dashboard Coordinador</h1>
          <p className="text-sm text-gray-500 mt-0.5">Panel de control del coordinador deportivo</p>
        </div>
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-gray-50">
                    <Icon size={24} className={color} />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">{label}</p>
                </div>
                <p className={`text-4xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
