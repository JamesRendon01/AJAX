import { useState } from "react";
import { Eye, EyeOff, Users, AlertCircle } from "lucide-react";
import authService from "../../services/authService";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
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
      } else {
        window.location.href = "/entrenador/dashboard";
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-[#2d2d2d] rounded-2xl p-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 rounded-xl p-4">
            <Users className="text-white w-10 h-10" />
          </div>
        </div>

        <h1 className="text-white text-2xl font-medium text-center">Sistema de Gestión</h1>
        <p className="text-gray-400 text-center mt-1 mb-8">Club Deportivo</p>

        <div className="mb-5">
          <label className="text-gray-400 text-sm mb-2 block">Usuario</label>
          <input
            type="text"
            placeholder="Ingresa tu usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-5">
          <label className="text-gray-400 text-sm mb-2 block">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 pr-12"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-blue-600 w-4 h-4"
          />
          <span className="text-gray-400 text-sm">Recordarme</span>
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        {error && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-400 rounded-lg px-4 py-3 mt-4">
            <AlertCircle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
            <span className="text-yellow-700 text-sm">Usuario o contraseña incorrectos</span>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm mt-6">
        © 2025 Club Deportivo · Todos los derechos reservados
      </p>
    </div>
  );
}