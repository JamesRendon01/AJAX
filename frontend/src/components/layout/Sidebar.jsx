import { LayoutDashboard, Users, Home, User, FileText, Calendar, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import authService from "../../services/authService";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/entrenadores", icon: Users, label: "Entrenadores" },
  { to: "/grupos", icon: Home, label: "Grupos" },
  { to: "/jugadores", icon: User, label: "Jugadores" },
  { to: "/asistencias", icon: FileText, label: "Asistencias" },
  { to: "/planeaciones", icon: Calendar, label: "Planeaciones" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-red-500 flex flex-col min-h-screen shadow-xl">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/Logo.jpeg"
            alt="Club"
            className="w-10 h-10 rounded-lg object-contain bg-white p-1"
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Club Deportivo</p>
            <p className="text-white/70 text-xs mt-0.5">Panel Administrador</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-all ${
                isActive
                  ? "bg-white text-red-600 font-semibold shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">Administrador</p>
            <button
              onClick={authService.logout}
              className="text-white/70 text-xs hover:text-white flex items-center gap-1 transition-colors"
            >
              <LogOut size={11} /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
