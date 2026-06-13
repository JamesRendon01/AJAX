import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import SidebarCoordinador from "../../components/layout/SidebarCoordinador";
import entrenadorService from "../../services/entrenadorService";
import authService from "../../services/authService";
import usePageTitle from "../../hooks/usePageTitle";

export default function Entrenadores() {
  usePageTitle("Entrenadores");
  const [entrenadores, setEntrenadores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editando, setEditando] = useState(null);
  const [files, setFiles] = useState({});
  const rol = authService.getRol();
  const esAdmin = rol === "admin";
  const esCoordinador = rol === "coordinador";

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await entrenadorService.getAll();
      setEntrenadores(data);
    } catch (error) {
      console.error("Error cargando:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtrados = entrenadores.filter((e) =>
    e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.documento?.includes(busqueda)
  );

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const abrirNuevo = () => {
    setEditando(null);
    setFiles({});
    setModal({
      nombre: "", tipoDocumento: "", documento: "", celular: "",
      cargo: "", email: "", coced: "", contactoEmergencia: "",
      fechaInicio: "", fechaFin: "",
    });
  };

  const abrirEditar = (e) => {
    setEditando(e);
    setFiles({});
    setModal({
      nombre: e.nombre || "", tipoDocumento: e.tipoDocumento || "",
      documento: e.documento || "", celular: e.celular || "",
      cargo: e.cargo || "", email: e.email || "",
      coced: e.coced || "", contactoEmergencia: e.contactoEmergencia || "",
      fechaInicio: e.fechaInicio || "", fechaFin: e.fechaFin || "",
    });
  };

  const guardarModal = async () => {
    try {
      const data = { ...modal };
      Object.keys(files).forEach((key) => {
        if (files[key]) data[key] = files[key];
      });
      if (editando) {
        await entrenadorService.update(editando.id, data);
      } else {
        await entrenadorService.create(data);
      }
      setModal(null);
      setEditando(null);
      setFiles({});
      cargarDatos();
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar entrenador?")) return;
    try {
      await entrenadorService.delete(id);
      cargarDatos();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fileFields = [
    { key: "certificado", label: "Certificado" },
    { key: "delitosSexuales", label: "Delitos sexuales" },
    { key: "tarjetaProfesional", label: "Tarjeta profesional" },
    { key: "certificadoPrimerCorrespondiente", label: "Primeros auxilios" },
    { key: "evaluacion", label: "Evaluación" },
  ];

  return (
    <div className="flex min-h-screen bg-club-dark">
      {esCoordinador ? <SidebarCoordinador /> : <Sidebar />}
      <div className="flex-1 flex flex-col pt-14 lg:pt-0">
        <div className="bg-white px-6 py-4 flex justify-between items-center flex-col sm:flex-row border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Gestión de Entrenadores</h1>
            <p className="text-sm text-gray-500 mt-0.5">Administra los entrenadores del club</p>
          </div>
          {esAdmin && (
            <button onClick={abrirNuevo} className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              + Agregar entrenador
            </button>
          )}
        </div>

        <div className="p-4 lg:p-6">
          <input type="text" placeholder="Buscar entrenador por nombre o documento"
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Nombre</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Documento</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Email</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">COCED</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Cargo</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Celular</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">F.Inicio</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Evaluación</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Certificado</th>
                  <th className="text-gray-600 text-sm font-semibold text-left px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10} className="text-center text-gray-400 py-8 text-sm">Cargando...</td></tr>
                ) : filtrados.length === 0 ? (
                  <tr><td colSpan={10} className="text-center text-gray-400 py-8 text-sm">Sin resultados</td></tr>
                ) : (
                  filtrados.map((e, i) => (
                    <tr key={e.id} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="text-gray-800 text-sm px-4 py-4 font-medium">{e.nombre}</td>
                      <td className="text-gray-600 text-sm px-4 py-4">{e.documento}</td>
                      <td className="text-gray-600 text-sm px-4 py-4">{e.email || "-"}</td>
                      <td className="text-gray-600 text-sm px-4 py-4">{e.coced || "-"}</td>
                      <td className="text-gray-600 text-sm px-4 py-4">{e.cargo}</td>
                      <td className="text-gray-600 text-sm px-4 py-4">{e.celular}</td>
                      <td className="text-gray-600 text-sm px-4 py-4">{formatDate(e.fechaInicio)}</td>
                      <td className="px-4 py-4">
                        {e.evaluacion ? (
                          <a href={e.evaluacion} target="_blank" rel="noopener noreferrer" className="text-club-blue text-xs hover:underline font-medium">Ver</a>
                        ) : <span className="text-gray-400 text-xs">-</span>}
                      </td>
                      <td className="px-4 py-4">
                        {e.certificado ? (
                          <a href={e.certificado} target="_blank" rel="noopener noreferrer" className="text-club-blue text-xs hover:underline font-medium">Ver</a>
                        ) : <span className="text-gray-400 text-xs">-</span>}
                      </td>
                      <td className="px-4 py-4 flex gap-1">
                        <button onClick={() => abrirEditar(e)} className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs px-3 py-1.5 rounded-md transition-colors">Editar</button>
                        {esAdmin && (
                          <button onClick={() => eliminar(e.id)} className="border border-red-200 text-club-red text-xs px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors">Eliminar</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
            <p className="text-gray-400 text-sm px-4 py-3 border-t border-gray-100">
              Mostrando {filtrados.length} de {entrenadores.length} entrenadores
            </p>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-full sm:max-w-2xl mx-2 sm:mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-club-blue">{editando ? "Editar" : "Nuevo"} entrenador</h2>
              <button onClick={() => { setModal(null); setEditando(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-gray-600 text-sm font-medium block mb-1">Nombre</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.nombre} onChange={(e) => setModal({...modal, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Tipo documento</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.tipoDocumento} onChange={(e) => setModal({...modal, tipoDocumento: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Documento</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.documento} onChange={(e) => setModal({...modal, documento: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Celular</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.celular} onChange={(e) => setModal({...modal, celular: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Email</label>
                  <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.email} onChange={(e) => setModal({...modal, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">COCED</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.coced} onChange={(e) => setModal({...modal, coced: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Cargo</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.cargo} onChange={(e) => setModal({...modal, cargo: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Contacto emergencia</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.contactoEmergencia} onChange={(e) => setModal({...modal, contactoEmergencia: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Fecha inicio</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.fechaInicio} onChange={(e) => setModal({...modal, fechaInicio: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Fecha fin</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.fechaFin} onChange={(e) => setModal({...modal, fechaFin: e.target.value})} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Documentos</p>
                <div className="space-y-3">
                  {fileFields.map(({ key, label }) => (
                    <div key={key} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                      <p className="text-xs font-medium text-gray-600 mb-2">{label}</p>
                      <input type="file" className="w-full text-xs" onChange={(e) => setFiles({...files, [key]: e.target.files[0] || null})} />
                      {editando && editando[key] && (
                        <p className="text-xs text-gray-400 mt-1">Actual: <a href={editando[key]} target="_blank" className="text-club-blue underline">Ver</a></p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => { setModal(null); setEditando(null); }} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={guardarModal} className="px-4 py-2 text-sm text-white bg-club-blue rounded-lg hover:bg-blue-800 font-medium">{editando ? "Guardar" : "Crear"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
