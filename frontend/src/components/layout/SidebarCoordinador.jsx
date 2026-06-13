import { useState } from "react";
import { LayoutDashboard, Users, User, Calendar, LogOut, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import authService from "../../services/authService";

const navItems = [
  { to: "/coordinador/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/coordinador/planeaciones", icon: Calendar, label: "Planeaciones" },
  { to: "/coordinador/jugadores", icon: User, label: "Jugadores" },
  { to: "/coordinador/entrenadores", icon: Users, label: "Entrenadores" },
];

export default function SidebarCoordinador() {
  const [open, setOpen] = useState(false);
  const user = authService.getCurrentUser();
  const initials = user?.nombre?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "CO";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu size={22} className="text-gray-700" />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          w-64 bg-white flex flex-col min-h-screen shadow-xl
          fixed lg:static inset-y-0 left-0 z-40
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="px-5 py-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/Logo.jpeg"
              alt="Club"
              className="w-10 h-10 rounded-lg object-contain bg-white p-1"
            />
            <div>
              <p className="text-black font-bold text-sm leading-tight">Club Deportivo</p>
              <p className="text-gray-500 text-xs mt-0.5">Panel Coordinador</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-all ${
                  isActive
                    ? "bg-red-50 text-red-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-medium truncate">{user?.nombre || "Coordinador"}</p>
              <button
                onClick={authService.logout}
                className="text-gray-500 text-xs hover:text-gray-700 flex items-center gap-1 transition-colors"
              >
                <LogOut size={11} /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
