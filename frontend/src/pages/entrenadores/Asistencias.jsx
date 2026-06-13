import { useEffect, useState } from "react";
import SidebarEntrenador from "../../components/layout/SidebarEntrenador";
import asistenciaService from "../../services/asistenciaAdminService";
import authService from "../../services/authService";
import usePageTitle from "../../hooks/usePageTitle";

export default function Asistencias() {
  usePageTitle("Asistencias Entrenador");
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [asistencias, setAsistencias] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    asistenciaService.getAll().then(setAsistencias).catch(() => {});
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setArchivo(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!nombre || !archivo) return;
    setSubiendo(true);
    try {
      await asistenciaService.create({ nombre, archivo });
      setNombre("");
      setArchivo(null);
      const data = await asistenciaService.getAll();
      setAsistencias(data);
    } catch (error) {
      console.error("Error subiendo:", error);
    } finally {
      setSubiendo(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-club-dark">
      <SidebarEntrenador />
      <div className="flex-1 min-h-screen flex flex-col pt-14 lg:pt-0">
        <div className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
          <h1 className="text-xl font-bold text-club-blue">Asistencias</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sube y gestiona los archivos de asistencia</p>
        </div>

        <div className="p-4 lg:p-6 space-y-6 flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-gray-800 font-bold text-lg mb-4">Subir nueva asistencia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-2">Nombre</label>
                <input type="text" placeholder="Ej: Asistencia semana 1"
                  value={nombre} onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent" />
              </div>
            </div>

            <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)} onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                dragging ? "border-club-blue bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}>
              <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {archivo ? (
                <p className="text-green-600 text-sm font-medium">{archivo.name}</p>
              ) : (
                <>
                  <p className="text-gray-500 text-sm mb-3">Arrastra tu archivo aquí o</p>
                  <label className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors">
                    Seleccionar archivo
                    <input type="file" className="hidden" accept=".xlsx,.csv,.pdf" onChange={(e) => setArchivo(e.target.files[0])} />
                  </label>
                  <p className="text-gray-400 text-xs mt-3">Formatos aceptados: .xlsx, .csv, .pdf</p>
                </>
              )}
            </div>

            <button onClick={handleUpload} disabled={subiendo || !nombre || !archivo}
              className="mt-4 bg-club-blue hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              {subiendo ? "Subiendo..." : "Subir asistencia"}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-gray-800 font-bold text-lg mb-4">Historial de asistencias</h2>
            {asistencias.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Sin asistencias registradas</p>
            ) : (
              asistencias.map((a, i) => (
                <div key={a.id} className={`flex items-center gap-3 py-3 ${i < asistencias.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm font-medium">{a.nombre}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Cargado: {formatDate(a.fechaCarga)}</p>
                  </div>
                  {a.archivo ? (
                    <a href={a.archivo} target="_blank" rel="noopener noreferrer" className="bg-green-50 text-green-700 border border-green-200 text-xs px-3 py-1 rounded-full font-medium hover:bg-green-100">
                      Ver archivo
                    </a>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">Sin archivo</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
