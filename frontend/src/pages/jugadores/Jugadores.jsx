import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import SidebarCoordinador from "../../components/layout/SidebarCoordinador";
import authService from "../../services/authService";
import jugadorService from "../../services/jugadorService";
import api from "../../services/api";
import usePageTitle from "../../hooks/usePageTitle";

export default function Jugadores() {
  usePageTitle("Jugadores");
  const [jugadores, setJugadores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [editando, setEditando] = useState(null);
  const [files, setFiles] = useState({});
  const [detalleId, setDetalleId] = useState(null);
  const rol = authService.getRol();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [j, c] = await Promise.all([
        jugadorService.getAll(),
        api.get("/categorias/").then((r) => r.data),
      ]);
      setJugadores(j);
      setCategorias(c);
    } catch (error) {
      console.error("Error cargando:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaNombre = (idCat) => {
    const cat = categorias.find((c) => c.id === idCat);
    return cat ? `${cat.nombre} ${cat.ano}` : "-";
  };

  const getEntrenadorNombre = (idCat) => {
    const cat = categorias.find((c) => c.id === idCat);
    if (!cat?.idEntrenador) return "-";
    const ent = cat.entrenador || {};
    return ent.nombre || "-";
  };

  const filtrados = jugadores.filter((j) => {
    const matchBusqueda = !busqueda || j.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || j.documento?.includes(busqueda);
    return matchBusqueda;
  });

  const abrirNuevo = () => {
    setEditando(null);
    setFiles({});
    setModal({
      nombre: "", nacionalidad: "", tipoDocumento: "", documento: "",
      fechaNacimiento: "", edad: "", dorsal: "", contactoEmergencia: "",
      estado: "activo", fechaIngreso: "", fechaSalida: "", torneo: "",
      idCategoria: "",
    });
  };

  const abrirEditar = (j) => {
    setEditando(j);
    setFiles({});
    setModal({
      nombre: j.nombre || "", nacionalidad: j.nacionalidad || "", tipoDocumento: j.tipoDocumento || "",
      documento: j.documento || "", fechaNacimiento: j.fechaNacimiento || "", edad: j.edad || "",
      dorsal: j.dorsal || "", contactoEmergencia: j.contactoEmergencia || "",
      estado: j.estado || "activo", fechaIngreso: j.fechaIngreso || "", fechaSalida: j.fechaSalida || "",
      torneo: j.torneo || "", idCategoria: j.idCategoria || "",
      devolucion1_fechaInicio: j.devolucion1_fechaInicio || "",
      devolucion1_fechaFin: j.devolucion1_fechaFin || "",
      devolucion2_fechaInicio: j.devolucion2_fechaInicio || "",
      devolucion2_fechaFin: j.devolucion2_fechaFin || "",
      devolucion3_fechaInicio: j.devolucion3_fechaInicio || "",
      devolucion3_fechaFin: j.devolucion3_fechaFin || "",
    });
  };

  const guardarModal = async () => {
    try {
      const data = { ...modal };
      Object.keys(files).forEach((key) => {
        if (files[key]) data[key] = files[key];
      });
      if (editando) {
        await jugadorService.update(editando.id, data);
      } else {
        await jugadorService.create(data);
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
    if (!confirm("¿Eliminar jugador?")) return;
    try {
      await jugadorService.delete(id);
      cargarDatos();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const devolucionesCount = (j) => {
    let count = 0;
    if (j.devolucion1) count++;
    if (j.devolucion2) count++;
    if (j.devolucion3) count++;
    return count;
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-club-dark">
        <div className="animate-spin w-8 h-8 border-4 border-club-blue border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-club-dark">
      {rol === "coordinador" ? <SidebarCoordinador /> : <Sidebar />}
      <div className="flex-1 min-h-screen flex flex-col pt-14 lg:pt-0">
        <div className="bg-white px-6 py-4 flex justify-between items-center flex-col sm:flex-row border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Deportistas</h1>
            <p className="text-sm text-gray-500 mt-0.5">Lista general de todos los deportistas del club</p>
          </div>
          <div className="flex gap-2"></div>
        </div>

        <div className="p-4 lg:p-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Total</p>
              <p className="text-club-blue text-3xl font-bold">{jugadores.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Grupo Rojo</p>
              <p className="text-club-red text-3xl font-bold">{jugadores.filter((j) => j.idCategoria && categorias.find((c) => c.id === j.idCategoria)?.nombre?.toLowerCase().includes("rojo")).length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Grupo Azul</p>
              <p className="text-club-blue text-3xl font-bold">{jugadores.filter((j) => j.idCategoria && categorias.find((c) => c.id === j.idCategoria)?.nombre?.toLowerCase().includes("azul")).length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Grupo Blanco</p>
              <p className="text-gray-600 text-3xl font-bold">{jugadores.filter((j) => j.idCategoria && categorias.find((c) => c.id === j.idCategoria)?.nombre?.toLowerCase().includes("blanco")).length}</p>
            </div>
          </div>

          <input type="text" placeholder="Buscar por nombre o documento..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent" />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table data-responsive className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Nombre", "Documento", "Grupo", "Dorsal", "Estado", "Devoluciones", "Acciones"].map((h) => (
                    <th key={h} className="text-gray-600 text-sm font-semibold text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((j) => (
                  <tr key={j.id} className="border-b border-gray-100 last:border-0">
                    <td data-label="Nombre" className="text-gray-800 text-sm px-4 py-4 font-medium">{j.nombre}</td>
                    <td data-label="Documento" className="text-gray-600 text-sm px-4 py-4">{j.documento}</td>
                    <td data-label="Grupo" className="px-4 py-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-md border bg-blue-50 text-blue-700 border-blue-200">
                        {getCategoriaNombre(j.idCategoria)}
                      </span>
                    </td>
                    <td data-label="Dorsal" className="text-gray-600 text-sm px-4 py-4">{j.dorsal || "-"}</td>
                    <td data-label="Estado" className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        j.estado === "activo"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {j.estado === "activo" ? "Activo" : j.estado || "Inactivo"}
                      </span>
                    </td>
                    <td data-label="Devoluciones" className="px-4 py-4">
                      <button onClick={() => setDetalleId(detalleId === j.id ? null : j.id)}
                        className="text-club-blue text-xs font-medium hover:underline">
                        {devolucionesCount(j)} devolucione{devolucionesCount(j) !== 1 ? "s" : ""}
                      </button>
                    </td>
                    <td data-label="Acciones" className="px-4 py-4 flex gap-1">
                      <button onClick={() => abrirEditar(j)} className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs px-3 py-1.5 rounded-md transition-colors">Editar</button>
                      <button onClick={() => eliminar(j.id)} className="border border-red-200 text-club-red text-xs px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <p className="text-gray-400 text-sm px-4 py-3 border-t border-gray-100">Mostrando {filtrados.length} de {jugadores.length} deportistas</p>
          </div>
        </div>
      </div>

      {detalleId && (() => {
        const j = jugadores.find((j) => j.id === detalleId);
        if (!j) return null;
        return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDetalleId(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-club-blue">Devoluciones - {j.nombre}</h2>
                <button onClick={() => setDetalleId(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((n) => {
                  const key = `devolucion${n}`;
                  if (!j[key]) return (
                    <div key={n} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                      <p className="text-sm font-medium text-gray-500 mb-1">Devolución {n}</p>
                      <p className="text-xs text-gray-400">Sin registro</p>
                    </div>
                  );
                  return (
                    <div key={n} className="border border-gray-100 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Devolución {n}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Inicio: <strong className="text-gray-700">{j[`${key}_fechaInicio`]}</strong></span>
                        <span>Fin: <strong className="text-gray-700">{j[`${key}_fechaFin`]}</strong></span>
                        <a href={j[key]} target="_blank" rel="noopener noreferrer" className="text-club-blue font-medium hover:underline">Ver archivo</a>
                      </div>
                    </div>
                  );
                })}
                <div className={`border rounded-lg p-4 ${j.devoluciones ? "border-gray-100" : "border-gray-100 bg-gray-50"}`}>
                  <p className="text-sm font-medium text-gray-700 mb-2">Documento Devoluciones</p>
                  {j.devoluciones ? (
                    <a href={j.devoluciones} target="_blank" rel="noopener noreferrer" className="text-club-blue text-xs font-medium hover:underline">Ver archivo</a>
                  ) : (
                    <p className="text-xs text-gray-400">Sin archivo</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-full sm:max-w-2xl mx-2 sm:mx-4 p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-club-blue">{editando ? "Editar" : "Nuevo"} deportista</h2>
              <button onClick={() => { setModal(null); setEditando(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Nombre</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.nombre} onChange={(e) => setModal({...modal, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Documento</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.documento} onChange={(e) => setModal({...modal, documento: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Nacionalidad</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.nacionalidad} onChange={(e) => setModal({...modal, nacionalidad: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Tipo documento</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.tipoDocumento} onChange={(e) => setModal({...modal, tipoDocumento: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Fecha nacimiento</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.fechaNacimiento} onChange={(e) => setModal({...modal, fechaNacimiento: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Edad</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.edad} onChange={(e) => setModal({...modal, edad: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Dorsal</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.dorsal} onChange={(e) => setModal({...modal, dorsal: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Contacto emergencia</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.contactoEmergencia} onChange={(e) => setModal({...modal, contactoEmergencia: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Estado</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white" value={modal.estado} onChange={(e) => setModal({...modal, estado: e.target.value})}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Grupo (categoría)</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white" value={modal.idCategoria} onChange={(e) => setModal({...modal, idCategoria: e.target.value ? Number(e.target.value) : null})}>
                    <option value="">Seleccionar</option>
                    {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre} {c.ano}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Fecha ingreso</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.fechaIngreso} onChange={(e) => setModal({...modal, fechaIngreso: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Fecha salida</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.fechaSalida} onChange={(e) => setModal({...modal, fechaSalida: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-gray-600 text-sm font-medium block mb-1">Torneo</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.torneo} onChange={(e) => setModal({...modal, torneo: e.target.value})} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Devoluciones</p>
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                      <p className="text-xs font-medium text-gray-600 mb-2">Devolución {n}</p>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="text-gray-500 text-xs block mb-1">Fecha inicio</label>
                          <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs" value={modal[`devolucion${n}_fechaInicio`]} onChange={(e) => setModal({...modal, [`devolucion${n}_fechaInicio`]: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-gray-500 text-xs block mb-1">Fecha fin</label>
                          <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs" value={modal[`devolucion${n}_fechaFin`]} onChange={(e) => setModal({...modal, [`devolucion${n}_fechaFin`]: e.target.value})} />
                        </div>
                      </div>
                      <input type="file" className="w-full text-xs" onChange={(e) => setFiles({...files, [`devolucion${n}`]: e.target.files[0] || null})} />
                      {editando && editando[`devolucion${n}`] && (
                        <p className="text-xs text-gray-400 mt-1">Actual: <a href={editando[`devolucion${n}`]} target="_blank" className="text-club-blue underline">Ver</a></p>
                      )}
                    </div>
                  ))}
                  <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                    <p className="text-xs font-medium text-gray-600 mb-2">Documento Devoluciones</p>
                    <input type="file" className="w-full text-xs" onChange={(e) => setFiles({...files, devoluciones: e.target.files[0] || null})} />
                    {editando && editando.devoluciones && (
                      <p className="text-xs text-gray-400 mt-1">Actual: <a href={editando.devoluciones} target="_blank" className="text-club-blue underline">Ver</a></p>
                    )}
                  </div>
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
