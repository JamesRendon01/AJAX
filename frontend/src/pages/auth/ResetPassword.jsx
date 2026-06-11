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
        setError("El enlace es inválido o ha expirado.");
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [token]);

  const handleSubmit = async () => {
    if (!password || password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-club-blue via-blue-800 to-blue-900 flex items-center justify-center">
        <Loader className="animate-spin text-white w-8 h-8" />
      </div>
    );
  }

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
            className="w-20 h-20 object-contain mb-4"
          />
        </div>

        {done ? (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500 w-16 h-16" />
            </div>
            <h1 className="text-gray-800 text-2xl font-bold text-center">Contraseña actualizada</h1>
            <p className="text-gray-500 text-center mt-2">
              Serás redirigido al inicio de sesión...
            </p>
          </>
        ) : !validToken ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-xl p-4">
                <AlertCircle className="text-club-red w-10 h-10" />
              </div>
            </div>
            <h1 className="text-gray-800 text-2xl font-bold text-center">Enlace inválido</h1>
            <p className="text-gray-500 text-center mt-2 mb-6">{error}</p>
            <a
              href="/forgot-password"
              className="block w-full text-center bg-club-blue hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-all shadow-md"
            >
              Solicitar nuevo enlace
            </a>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-club-blue rounded-xl p-4 shadow-lg">
                <Lock className="text-white w-8 h-8" />
              </div>
            </div>
            <h1 className="text-gray-800 text-2xl font-bold text-center">Nueva contraseña</h1>
            <p className="text-gray-500 text-center mt-1 mb-8">
              Ingresa tu nueva contraseña
            </p>

            <div className="mb-6">
              <label className="text-gray-600 text-sm font-medium mb-2 block">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Actualizando..." : "Restablecer contraseña"}
            </button>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
                <AlertCircle className="text-club-red w-5 h-5 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
          </>
        )}

        <a
          href="/login"
          className="flex items-center justify-center gap-2 text-gray-500 hover:text-club-blue text-sm mt-6 transition-colors"
        >
          Volver al inicio de sesión
        </a>
      </div>

      <p className="text-white/70 text-sm mt-6 relative z-10">
        &copy; 2026 Club Deportivo &middot; Todos los derechos reservados
      </p>
    </div>
  );
}
