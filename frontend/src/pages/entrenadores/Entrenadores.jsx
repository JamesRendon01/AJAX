import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import entrenadorService from "../../services/entrenadorService";

export default function Entrenadores() {
  const [entrenadores, setEntrenadores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    entrenadorService.getAll().then((data) => {
      setEntrenadores(data);
      setLoading(false);
    });
  }, []);

  const filtrados = entrenadores.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.documento.includes(busqueda)
  );

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Gestión de Entrenadores</h1>
            <p className="text-sm text-gray-500 mt-0.5">Administra los entrenadores del club</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            + Agregar entrenador
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar entrenador por nombre o documento"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#2d2d2d] text-gray-400 rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {/* Tabla */}
          <div className="bg-[#2d2d2d] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-gray-400 text-sm font-normal text-left px-4 py-3">Nombre</th>
                  <th className="text-gray-400 text-sm font-normal text-left px-4 py-3">Documento</th>
                  <th className="text-gray-400 text-sm font-normal text-left px-4 py-3">Cargo</th>
                  <th className="text-gray-400 text-sm font-normal text-left px-4 py-3">Celular</th>
                  <th className="text-gray-400 text-sm font-normal text-left px-4 py-3">Certificado</th>
                  <th className="text-gray-400 text-sm font-normal text-left px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-gray-500 py-8 text-sm">Cargando...</td></tr>
                ) : filtrados.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-gray-500 py-8 text-sm">Sin resultados</td></tr>
                ) : (
                  filtrados.map((e) => (
                    <tr key={e.id} className="border-b border-gray-700 last:border-0">
                      <td className="text-white text-sm px-4 py-4 font-medium">{e.nombre}</td>
                      <td className="text-gray-300 text-sm px-4 py-4">{e.documento}</td>
                      <td className="text-gray-300 text-sm px-4 py-4">{e.cargo}</td>
                      <td className="text-gray-300 text-sm px-4 py-4">{e.celular}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          e.certificado === "vigente"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {e.certificado === "vigente" ? "Vigente" : "Vencido"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-xs px-3 py-1.5 rounded-md transition-colors">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <p className="text-gray-500 text-sm px-4 py-3">
              Mostrando {filtrados.length} de {entrenadores.length} entrenadores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}