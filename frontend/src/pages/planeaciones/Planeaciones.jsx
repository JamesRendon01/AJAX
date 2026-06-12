import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import planeacionService from "../../services/planeacionService";
import api from "../../services/api";

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
  const [planeaciones, setPlaneaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar planeación?")) return;
    try {
      await planeacionService.delete(id);
      setPlaneaciones(planeaciones.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error:", error);
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-club-blue border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-start border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Planeaciones</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Historial general de planeaciones de todos los entrenadores
            </p>
          </div>
          <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2 rounded-lg transition-colors">
            Exportar
          </button>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[22%]">Nombre</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[15%]">Grupo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[16%]">Entrenador</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[13%]">Fecha inicio</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[13%]">Fecha fin</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[10%]">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[11%]">Acciones</th>
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
                    <td className="px-4 py-3">
                      <Badge color={getEstado(p)}>{getEstado(p)}</Badge>
                    </td>
                    <td className="px-4 py-3 flex gap-1">
                      <button className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs rounded-md transition-colors">Ver</button>
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
    </div>
  );
}
