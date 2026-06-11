import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Ingresa tu correo electronico");
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-[#2d2d2d] rounded-2xl p-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 rounded-xl p-4">
            <Mail className="text-white w-10 h-10" />
          </div>
        </div>

        {!sent ? (
          <>
            <h1 className="text-white text-2xl font-medium text-center">Recuperar contrasena</h1>
            <p className="text-gray-400 text-center mt-1 mb-8">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contrasena
            </p>

            <div className="mb-6">
              <label className="text-gray-400 text-sm mb-2 block">Correo electronico</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-400 rounded-lg px-4 py-3 mt-4">
                <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500 w-16 h-16" />
            </div>
            <h1 className="text-white text-2xl font-medium text-center">Revisa tu correo</h1>
            <p className="text-gray-400 text-center mt-2 mb-4">
              Te hemos enviado un enlace de recuperacion a <strong className="text-white">{email}</strong>
            </p>
            <p className="text-gray-500 text-center text-sm mb-6">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
            </p>
          </>
        )}

        <a
          href="/login"
          className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm mt-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio de sesion
        </a>
      </div>

      <p className="text-gray-400 text-sm mt-6">
        &copy; 2025 Club Deportivo &middot; Todos los derechos reservados
      </p>
    </div>
  );
}
