import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../services/api";
import usePageTitle from "../../hooks/usePageTitle";

export default function ForgotPassword() {
  usePageTitle("Recuperar Contraseña");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Ingresa tu correo electrónico");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setError("Error al enviar la solicitud. Intenta de nuevo.");
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
            className="w-20 h-20 object-contain mb-4"
          />
        </div>

        {!sent ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-club-blue rounded-xl p-4 shadow-lg">
                <Mail className="text-white w-8 h-8" />
              </div>
            </div>
            <h1 className="text-gray-800 text-2xl font-bold text-center">Recuperar contraseña</h1>
            <p className="text-gray-500 text-center mt-1 mb-8">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
            </p>

            <div className="mb-6">
              <label className="text-gray-600 text-sm font-medium mb-2 block">Correo electrónico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-club-blue hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
                <AlertCircle className="text-club-red w-5 h-5 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500 w-16 h-16" />
            </div>
            <h1 className="text-gray-800 text-2xl font-bold text-center">Revisa tu correo</h1>
            <p className="text-gray-500 text-center mt-2 mb-4">
              Te hemos enviado un enlace de recuperación a <strong className="text-gray-800">{email}</strong>
            </p>
            <p className="text-gray-400 text-center text-sm mb-6">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
            </p>
          </>
        )}

        <a
          href="/login"
          className="flex items-center justify-center gap-2 text-gray-500 hover:text-club-blue text-sm mt-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio de sesión
        </a>
      </div>

      <p className="text-white/70 text-sm mt-6 relative z-10">
        &copy; 2026 Club Deportivo &middot; Todos los derechos reservados
      </p>
    </div>
  );
}
