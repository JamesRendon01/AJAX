import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import authService from "../../services/authService";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError(true);
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const usuario = await authService.login(form);
      if (usuario.rol === "admin") {
        window.location.href = "/dashboard";
      } else if (usuario.rol === "coordinador") {
        window.location.href = "/coordinador/dashboard";
      } else {
        window.location.href = "/entrenador/dashboard";
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-club-blue via-blue-800 to-blue-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-club-red rounded-full blur-3xl" />
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/Logo.jpeg"
            alt="Club Deportivo"
            className="w-24 h-24 object-contain mb-4"
          />
          <h1 className="text-2xl font-bold text-club-blue">CLUB DEPORTIVO AJAX</h1>
          <p className="text-gray-500 text-sm mt-1">Sistema de Gestión Administrativa y Deportiva</p>
        </div>

        <div className="mb-5">
          <label className="text-gray-600 text-sm font-medium mb-2 block">Usuario</label>
          <input
            type="text"
            placeholder="Ingresa tu usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-600 text-sm font-medium mb-2 block">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent pr-12 transition-all"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-club-blue hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <a
          href="/forgot-password"
          className="block text-center text-gray-500 hover:text-club-blue text-sm mt-4 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </a>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
            <AlertCircle className="text-club-red w-5 h-5 flex-shrink-0" />
            <span className="text-red-700 text-sm">Usuario o contraseña incorrectos</span>
          </div>
        )}
      </div>

      <p className="text-white/70 text-sm mt-6 relative z-10">
        &copy; 2026 Club Deportivo &middot; Todos los derechos reservados
      </p>
    </div>
  );
}
