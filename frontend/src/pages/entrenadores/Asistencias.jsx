import { useState } from "react";
import SidebarEntrenador from "../../components/layout/SidebarEntrenador";
import { mockAsistencias } from "../../mock/data";

export default function Asistencias() {
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setArchivo(e.dataTransfer.files[0]);
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <SidebarEntrenador />
      <div className="flex-1 flex flex-col">

        <div className="bg-[#2d2d2d] px-6 py-4 border-b border-gray-700">
          <h1 className="text-white text-xl font-medium">Asistencias</h1>
          <p className="text-gray-400 text-sm mt-0.5">Sube y gestiona los archivos de asistencia</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Formulario subir */}
          <div className="bg-[#2d2d2d] rounded-xl p-6">
            <h2 className="text-white font-medium mb-4">Subir nueva asistencia</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Asistencia semana 1"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Categoría</label>
                <input
                  type="text"
                  value="Categoría Rojo 2025"
                  readOnly
                  className="w-full bg-[#3a3a3a] border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                dragging ? "border-blue-500 bg-blue-900/10" : "border-gray-600"
              }`}
            >
              <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {archivo ? (
                <p className="text-green-400 text-sm">{archivo.name}</p>
              ) : (
                <>
                  <p className="text-gray-400 text-sm mb-3">Arrastra tu archivo aquí o</p>
                  <label className="bg-[#3a3a3a] border border-gray-500 text-gray-200 text-sm px-5 py-2 rounded-lg cursor-pointer hover:bg-[#444] transition-colors">
                    Seleccionar archivo
                    <input type="file" className="hidden" accept=".xlsx,.csv,.pdf" onChange={(e) => setArchivo(e.target.files[0])} />
                  </label>
                  <p className="text-gray-500 text-xs mt-3">Formatos aceptados: .xlsx, .csv, .pdf</p>
                </>
              )}
            </div>

            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
              Subir asistencia
            </button>
          </div>

          {/* Historial */}
          <div className="bg-[#2d2d2d] rounded-xl p-6">
            <h2 className="text-white font-medium mb-4">Historial de asistencias</h2>
            {mockAsistencias.map((a, i) => (
              <div key={a.id} className={`flex items-center gap-3 py-3 ${i < mockAsistencias.length - 1 ? "border-b border-gray-700" : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{a.nombre}</p>
                  <p className="text-gray-400 text-xs mt-0.5">Cargado: {a.fecha} · Rojo 2025</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">Subido</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}