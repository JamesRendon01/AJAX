import { useEffect, useState } from "react";
import SidebarEntrenador from "../../components/layout/SidebarEntrenador";
import planeacionService from "../../services/planeacionService";
import api from "../../services/api";

export default function Planeaciones() {
  const [planeaciones, setPlaneaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    planeacionService.getAll().then((data) => {
      setPlaneaciones(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const hoy = new Date();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarEntrenador />
      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Planeaciones</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestiona las planeaciones de tu grupo</p>
          </div>
          <button className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
            + Nueva planeación
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-club-blue border-t-transparent rounded-full" />
            </div>
          ) : planeaciones.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm">No hay planeaciones registradas</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {planeaciones.map((p) => {
                const fin = new Date(p.fechaFin);
                const activa = fin >= hoy;
                const fueraLapso = !p.lapsoInicio || !p.lapsoFin;
                const enLapso = !fueraLapso && hoy >= new Date(p.lapsoInicio) && hoy <= new Date(p.lapsoFin);

                return (
                  <div key={p.id} className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${activa ? "border-club-blue/30 ring-1 ring-club-blue/20" : "border-gray-100"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-800 font-bold text-lg leading-tight">{p.nombre}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ml-2 flex-shrink-0 ${
                        activa
                          ? "bg-blue-50 text-club-blue border-blue-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>
                        {activa ? "Activa" : "Finalizada"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Inicio</p>
                        <p className="text-gray-800 text-sm font-medium">{formatDate(p.fechaInicio)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Fin</p>
                        <p className="text-gray-800 text-sm font-medium">{formatDate(p.fechaFin)}</p>
                      </div>
                    </div>

                    {p.lapsoInicio && p.lapsoFin && (
                      <div className={`rounded-lg p-3 mb-4 ${enLapso ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Lapso de subida</p>
                        <p className={`text-sm font-medium ${enLapso ? "text-green-700" : "text-yellow-700"}`}>
                          {formatDate(p.lapsoInicio)} - {formatDate(p.lapsoFin)}
                        </p>
                        {!enLapso && (
                          <p className="text-xs text-yellow-600 mt-1">Fuera del lapso de tiempo para subir planeaciones</p>
                        )}
                      </div>
                    )}

                    {p.archivo && (
                      <div className="mb-3">
                        <a href={p.archivo} target="_blank" rel="noopener noreferrer" className="text-club-blue text-xs font-medium hover:underline">
                          Ver archivo
                        </a>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2 rounded-lg transition-colors">Ver archivo</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
