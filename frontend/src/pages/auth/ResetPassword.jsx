import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from "lucide-react";
import api from "../../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-reset-token/${token}`);
        setValidToken(true);
      } catch {
        setValidToken(false);
        setError("El enlace es invalido o ha expirado.");
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [token]);

  const handleSubmit = async () => {
    if (!password || password.length < 4) {
      setError("La contrasena debe tener al menos 4 caracteres");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al restablecer la contrasena");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-[#2d2d2d] rounded-2xl p-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 rounded-xl p-4">
            <Lock className="text-white w-10 h-10" />
          </div>
        </div>

        {done ? (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500 w-16 h-16" />
            </div>
            <h1 className="text-white text-2xl font-medium text-center">Contrasena actualizada</h1>
            <p className="text-gray-400 text-center mt-2">
              Seras redirigido al inicio de sesion...
            </p>
          </>
        ) : !validToken ? (
          <>
            <div className="flex justify-center mb-4">
              <AlertCircle className="text-red-500 w-16 h-16" />
            </div>
            <h1 className="text-white text-2xl font-medium text-center">Enlace invalido</h1>
            <p className="text-gray-400 text-center mt-2 mb-6">{error}</p>
            <a
              href="/forgot-password"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Solicitar nuevo enlace
            </a>
          </>
        ) : (
          <>
            <h1 className="text-white text-2xl font-medium text-center">Nueva contrasena</h1>
            <p className="text-gray-400 text-center mt-1 mb-8">
              Ingresa tu nueva contrasena
            </p>

            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">Nueva contrasena</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? "Actualizando..." : "Restablecer contrasena"}
            </button>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-400 rounded-lg px-4 py-3 mt-4">
                <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
          </>
        )}

        <a
          href="/login"
          className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm mt-6 transition-colors"
        >
          Volver al inicio de sesion
        </a>
      </div>

      <p className="text-gray-400 text-sm mt-6">
        &copy; 2025 Club Deportivo &middot; Todos los derechos reservados
      </p>
    </div>
  );
}
