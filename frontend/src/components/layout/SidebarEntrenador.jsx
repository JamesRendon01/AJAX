import { LayoutDashboard, Users, FileText, Calendar, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import authService from "../../services/authService";
import { mockEntrenadorActual } from "../../mock/data";

const navItems = [
  { to: "/entrenador/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/entrenador/jugadores", icon: Users, label: "Mis Jugadores" },
  { to: "/entrenador/asistencias", icon: FileText, label: "Asistencias" },
  { to: "/entrenador/planeaciones", icon: Calendar, label: "Planeaciones" },
];

export default function SidebarEntrenador() {
  const e = mockEntrenadorActual;
  return (
    <aside className="w-56 bg-[#1a4480] flex flex-col min-h-screen">
      <div className="px-4 py-5">
        <p className="text-white font-medium text-sm">Club Deportivo</p>
        <p className="text-blue-300 text-xs mt-1">Panel Entrenador</p>
      </div>
      <nav className="flex-1 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={17} />{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#3b5e8c] flex items-center justify-center text-white text-xs font-medium">
            {e.initials}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{e.nombre}</p>
            <button onClick={authService.logout} className="text-blue-300 text-xs hover:text-white flex items-center gap-1">
              <LogOut size={11} /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}