import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import SidebarCoordinador from "../../components/layout/SidebarCoordinador";
import authService from "../../services/authService";
import planeacionService from "../../services/planeacionService";
import api from "../../services/api";
import usePageTitle from "../../hooks/usePageTitle";

function Badge({ children, color }) {
  const colors = {
    rojo: { bg: "#FEF2F2", color: "#991B1B" },
    azul: { bg: "#EFF6FF", color: "#1E3A8A" },
    blanco: { bg: "#F9FAFB", color: "#4B5563" },
    blanca: { bg: "#F9FAFB", color: "#4B5563" },
    activa: { bg: "#EFF6FF", color: "#1E3A8A" },
    finalizada: { bg: "#F9FAFB", color: "#4B5563" },
  };
  const style = colors[color?.toLowerCase()] || colors.activa;
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {children}
    </span>
  );
}

export default function Planeaciones() {
  usePageTitle("Planeaciones");
  const [planeaciones, setPlaneaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const rol = authService.getRol();

  const [filtros, setFiltros] = useState({
    search: "",
    idCategoria: "",
    idEntrenador: "",
    estado: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [p, c, e] = await Promise.all([
        planeacionService.getAll(),
        api.get("/categorias/").then((r) => r.data),
        api.get("/entrenadores/").then((r) => r.data),
      ]);
      setPlaneaciones(p);
      setCategorias(c);
      setEntrenadores(e);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaNombre = (idCat) => {
    const cat = categorias.find((c) => c.id === idCat);
    return cat ? `${cat.nombre} ${cat.ano}` : "-";
  };

  const getCategoriaColor = (idCat) => {
    const cat = categorias.find((c) => c.id === idCat);
    const nombre = cat?.nombre?.toLowerCase() || "";
    if (nombre.includes("rojo")) return "rojo";
    if (nombre.includes("azul")) return "azul";
    if (nombre.includes("blanco")) return "blanco";
    return "azul";
  };

  const getEntrenadorNombre = (idCat) => {
    const cat = categorias.find((c) => c.id === idCat);
    if (!cat?.idEntrenador) return "-";
    const ent = entrenadores.find((e) => e.id === cat.idEntrenador);
    return ent ? ent.nombre : "-";
  };

  const getEstado = (planeacion) => {
    const hoy = new Date();
    const fin = new Date(planeacion.fechaFin);
    return fin >= hoy ? "Activa" : "Finalizada";
  };

  const [modal, setModal] = useState(null);
  const [editando, setEditando] = useState(null);
  const [archivoFile, setArchivoFile] = useState(null);
  const esAdminOCoordinador = rol === "admin" || rol === "coordinador";

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar planeación?")) return;
    try {
      await planeacionService.delete(id);
      setPlaneaciones(planeaciones.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const abrirEditar = (p) => {
    setEditando(p);
    setModal({
      nombre: p.nombre,
      fechaInicio: p.fechaInicio ? p.fechaInicio.split("T")[0] : "",
      fechaFin: p.fechaFin ? p.fechaFin.split("T")[0] : "",
      idCategoria: p.idCategoria || "",
      lapsoInicio: p.lapsoInicio ? p.lapsoInicio.split("T")[0] : "",
      lapsoFin: p.lapsoFin ? p.lapsoFin.split("T")[0] : "",
    });
  };

  const abrirNueva = () => {
    setEditando(null);
    setModal({ nombre: "", fechaInicio: "", fechaFin: "", idCategoria: "", lapsoInicio: "", lapsoFin: "" });
  };

  const guardarModal = async () => {
    try {
      const data = { ...modal };
      if (archivoFile) data.archivo = archivoFile;
      if (editando) {
        await planeacionService.update(editando.id, data);
      } else {
        await planeacionService.create(data);
      }
      setModal(null);
      setEditando(null);
      setArchivoFile(null);
      cargarDatos();
    } catch (error) {
      console.error("Error guardando:", error);
    }
  };

  const filtered = planeaciones.filter((p) => {
    if (filtros.search && !p.nombre?.toLowerCase().includes(filtros.search.toLowerCase())) return false;
    if (filtros.idCategoria && p.idCategoria !== parseInt(filtros.idCategoria)) return false;
    if (filtros.idEntrenador) {
      const cat = categorias.find((c) => c.id === p.idCategoria);
      if (!cat || cat.idEntrenador !== parseInt(filtros.idEntrenador)) return false;
    }
    if (filtros.estado) {
      const estado = getEstado(p);
      if (estado.toLowerCase() !== filtros.estado.toLowerCase()) return false;
    }
    return true;
  });

  const total = filtered.length;
  const activas = filtered.filter((p) => getEstado(p) === "Activa").length;
  const finalizadas = filtered.filter((p) => getEstado(p) === "Finalizada").length;
  const esteMes = filtered.filter((p) => {
    const fecha = new Date(p.fechaCarga);
    const hoy = new Date();
    return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
  }).length;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-club-dark">
        <div className="animate-spin w-8 h-8 border-4 border-club-blue border-t-transparent rounded-full" />
      </div>
    );

  const SidebarComponent = rol === "coordinador" ? SidebarCoordinador : Sidebar;

  return (
    <div className="flex min-h-screen bg-club-dark">
      <SidebarComponent />

      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-start border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Planeaciones</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Historial general de planeaciones de todos los entrenadores
            </p>
          </div>
          <div className="flex gap-2">
            {esAdminOCoordinador && (
              <button onClick={abrirNueva} className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg">
                + Nueva planeación
              </button>
            )}
            <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2 rounded-lg transition-colors">
              Exportar
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Total</p>
              <p className="text-club-blue text-3xl font-bold">{total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Activas</p>
              <p className="text-green-600 text-3xl font-bold">{activas}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Finalizadas</p>
              <p className="text-gray-600 text-3xl font-bold">{finalizadas}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Este mes</p>
              <p className="text-club-blue text-3xl font-bold">{esteMes}</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6 flex-wrap">
            <input
              type="text"
              placeholder="Buscar planeación..."
              className="flex-1 min-w-[180px] max-w-[260px] px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent"
              value={filtros.search}
              onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
            />
            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-club-blue"
              value={filtros.idCategoria}
              onChange={(e) => setFiltros({ ...filtros, idCategoria: e.target.value })}
            >
              <option value="">Todos los grupos</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre} {c.ano}</option>
              ))}
            </select>
            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-club-blue"
              value={filtros.idEntrenador}
              onChange={(e) => setFiltros({ ...filtros, idEntrenador: e.target.value })}
            >
              <option value="">Todos los entrenadores</option>
              {entrenadores.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-club-blue"
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            >
              <option value="">Todos los estados</option>
              <option value="activa">Activa</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Grupo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Entrenador</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Inicio</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fin</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Lapso inicio</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Lapso fin</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Archivo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="px-4 py-3 text-sm text-gray-800">{p.nombre}</td>
                    <td className="px-4 py-3">
                      <Badge color={getCategoriaColor(p.idCategoria)}>
                        {getCategoriaNombre(p.idCategoria)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getEntrenadorNombre(p.idCategoria)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(p.fechaInicio)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(p.fechaFin)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(p.lapsoInicio)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(p.lapsoFin)}</td>
                    <td className="px-4 py-3 text-sm">
                      {p.archivo ? <a href={p.archivo} target="_blank" className="text-club-blue underline hover:text-blue-800">Ver archivo</a> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={getEstado(p)}>{getEstado(p)}</Badge>
                    </td>
                    <td className="px-4 py-3 flex gap-1">
                      {esAdminOCoordinador && (
                        <button onClick={() => abrirEditar(p)} className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs rounded-md transition-colors">Editar</button>
                      )}
                      <button onClick={() => eliminar(p.id)} className="px-3 py-1.5 border border-red-200 text-club-red text-xs rounded-md hover:bg-red-50 transition-colors">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">Mostrando {total} de {total} planeaciones</p>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-club-blue">{editando ? "Editar" : "Nueva"} planeación</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1">Nombre</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.nombre} onChange={(e) => setModal({...modal, nombre: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Fecha inicio</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.fechaInicio} onChange={(e) => setModal({...modal, fechaInicio: e.target.value})} />
                </div>
                <div>
                  <label className="text-gray-600 text-sm font-medium block mb-1">Fecha fin</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.fechaFin} onChange={(e) => setModal({...modal, fechaFin: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1">Grupo</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white" value={modal.idCategoria} onChange={(e) => setModal({...modal, idCategoria: e.target.value})}>
                  <option value="">Seleccionar grupo</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre} {c.ano}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium block mb-1">Archivo (PDF, Excel)</label>
                <input type="file" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" onChange={(e) => setArchivoFile(e.target.files[0] || null)} />
                {editando?.archivo && (
                  <p className="text-xs text-gray-400 mt-1">Archivo actual: <a href={editando.archivo} target="_blank" className="text-club-blue underline">Ver</a></p>
                )}
              </div>
              {esAdminOCoordinador && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Lapso de tiempo (subida entrenadores)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-600 text-sm font-medium block mb-1">Inicio lapso</label>
                      <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.lapsoInicio} onChange={(e) => setModal({...modal, lapsoInicio: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-gray-600 text-sm font-medium block mb-1">Fin lapso</label>
                      <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm" value={modal.lapsoFin} onChange={(e) => setModal({...modal, lapsoFin: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={guardarModal} className="px-4 py-2 text-sm text-white bg-club-blue rounded-lg hover:bg-blue-800 font-medium">{editando ? "Guardar" : "Crear"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
