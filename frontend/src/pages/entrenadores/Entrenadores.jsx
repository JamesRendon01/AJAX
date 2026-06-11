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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Gestión de Entrenadores</h1>
            <p className="text-sm text-gray-500 mt-0.5">Administra los entrenadores del club</p>
          </div>
          <button className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
            + Agregar entrenador
          </button>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Buscar entrenador por nombre o documento"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent transition-all"
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Nombre</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Documento</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Cargo</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Celular</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Certificado</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center text-gray-400 py-8 text-sm">Cargando...</td></tr>
                ) : filtrados.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-gray-400 py-8 text-sm">Sin resultados</td></tr>
                ) : (
                  filtrados.map((e, i) => (
                    <tr key={e.id} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="text-gray-800 text-sm px-4 py-4 font-medium">{e.nombre}</td>
                      <td className="text-gray-600 text-sm px-4 py-4">{e.documento}</td>
                      <td className="text-gray-600 text-sm px-4 py-4">{e.cargo}</td>
                      <td className="text-gray-600 text-sm px-4 py-4">{e.celular}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          e.certificado === "vigente"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          {e.certificado === "vigente" ? "Vigente" : "Vencido"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs px-3 py-1.5 rounded-md transition-colors">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <p className="text-gray-400 text-sm px-4 py-3 border-t border-gray-100">
              Mostrando {filtrados.length} de {entrenadores.length} entrenadores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
