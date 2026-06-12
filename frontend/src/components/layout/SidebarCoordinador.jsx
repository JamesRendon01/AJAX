import { LayoutDashboard, Users, User, Calendar, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import authService from "../../services/authService";

const navItems = [
  { to: "/coordinador/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/coordinador/planeaciones", icon: Calendar, label: "Planeaciones" },
  { to: "/coordinador/jugadores", icon: User, label: "Jugadores" },
  { to: "/coordinador/entrenadores", icon: Users, label: "Entrenadores" },
];

export default function SidebarCoordinador() {
  const user = authService.getCurrentUser();
  const initials = user?.nombre?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "CO";

  return (
    <aside className="w-64 bg-red-500 flex flex-col min-h-screen shadow-xl">
      <div className="px-5 py-6 border-b border-black/10">
        <div className="flex items-center gap-3">
          <img
            src="/Logo.jpeg"
            alt="Club"
            className="w-10 h-10 rounded-lg object-contain bg-white p-1"
          />
          <div>
            <p className="text-black font-bold text-sm leading-tight">Club Deportivo</p>
            <p className="text-black/60 text-xs mt-0.5">Panel Coordinador</p>
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
                  ? "bg-white text-black font-semibold shadow-md"
                  : "text-black/70 hover:bg-black/10 hover:text-black"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-black/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-black text-xs font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-black text-sm font-medium truncate">{user?.nombre || "Coordinador"}</p>
            <button
              onClick={authService.logout}
              className="text-black/60 text-xs hover:text-black flex items-center gap-1 transition-colors"
            >
              <LogOut size={11} /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
