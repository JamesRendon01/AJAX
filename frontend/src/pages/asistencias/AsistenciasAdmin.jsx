import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import asistenciaService from "../../services/asistenciaAdminService";
import api from "../../services/api";
import { FileText } from "lucide-react";
import usePageTitle from "../../hooks/usePageTitle";

function Badge({ children, color }) {
  const colors = {
    rojo: { bg: "#FEF2F2", color: "#991B1B" },
    azul: { bg: "#EFF6FF", color: "#1E3A8A" },
    blanco: { bg: "#F9FAFB", color: "#4B5563" },
    blanca: { bg: "#F9FAFB", color: "#4B5563" },
  };
  const style = colors[color?.toLowerCase()] || colors.azul;
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {children}
    </span>
  );
}

export default function AsistenciasAdmin() {
  usePageTitle("Asistencias");
  const [asistencias, setAsistencias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState({
    search: "",
    idCategoria: "",
    idEntrenador: "",
    mes: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [a, c, e] = await Promise.all([
        asistenciaService.getAll(),
        api.get("/categorias/").then((r) => r.data),
        api.get("/entrenadores/").then((r) => r.data),
      ]);
      setAsistencias(a);
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

  const getEntrenadorNombreByCategoria = (idCat) => {
    const cat = categorias.find((c) => c.id === idCat);
    if (!cat?.idEntrenador) return "-";
    const ent = entrenadores.find((e) => e.id === cat.idEntrenador);
    return ent ? ent.nombre : "-";
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar asistencia?")) return;
    try {
      await asistenciaService.delete(id);
      setAsistencias(asistencias.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filtered = [...asistencias].filter((a) => {
    if (filtros.search && !a.nombre?.toLowerCase().includes(filtros.search.toLowerCase())) return false;
    if (filtros.idCategoria && a.idCategoria !== parseInt(filtros.idCategoria)) return false;
    if (filtros.idEntrenador) {
      const cat = categorias.find((c) => c.id === a.idCategoria);
      if (!cat || cat.idEntrenador !== parseInt(filtros.idEntrenador)) return false;
    }
    return true;
  });

  const total = filtered.length;
  const catRojo = filtered.filter((a) => {
    const cat = categorias.find((c) => c.id === a.idCategoria);
    return cat?.nombre?.toLowerCase().includes("rojo");
  }).length;
  const catAzul = filtered.filter((a) => {
    const cat = categorias.find((c) => c.id === a.idCategoria);
    return cat?.nombre?.toLowerCase().includes("azul");
  }).length;
  const catBlanco = filtered.filter((a) => {
    const cat = categorias.find((c) => c.id === a.idCategoria);
    return cat?.nombre?.toLowerCase().includes("blanco");
  }).length;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const meses = ["Enero 2026", "Febrero 2026", "Marzo 2026", "Abril 2026", "Mayo 2026", "Junio 2026"];

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-club-dark">
        <div className="animate-spin w-8 h-8 border-4 border-club-blue border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-club-dark">
      <Sidebar />

      <div className="flex-1 min-h-screen flex flex-col pt-14 lg:pt-0">
        <div className="bg-white px-6 py-4 flex justify-between items-start flex-col sm:flex-row border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Asistencias</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Historial general de asistencias subidas por todos los entrenadores
            </p>
          </div>
          <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2 rounded-lg transition-colors">
            Exportar
          </button>
        </div>

        <div className="p-4 lg:p-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Total archivos</p>
              <p className="text-club-blue text-3xl font-bold">{total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Cat. Rojo</p>
              <p className="text-club-red text-3xl font-bold">{catRojo}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Cat. Azul</p>
              <p className="text-club-blue text-3xl font-bold">{catAzul}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Cat. Blanco</p>
              <p className="text-gray-600 text-3xl font-bold">{catBlanco}</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6 flex-wrap">
            <input
              type="text"
              placeholder="Buscar por nombre..."
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
              value={filtros.mes}
              onChange={(e) => setFiltros({ ...filtros, mes: e.target.value })}
            >
              <option value="">Todos los meses</option>
              {meses.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table data-responsive className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre archivo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Grupo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Entrenador</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha carga</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 last:border-0">
                    <td data-label="Nombre archivo" className="px-4 py-3 text-sm text-gray-800 flex items-center gap-2">
                      <FileText size={14} className="text-club-blue" />
                      {a.nombre}
                    </td>
                    <td data-label="Grupo" className="px-4 py-3">
                      <Badge color={getCategoriaColor(a.idCategoria)}>
                        {getCategoriaNombre(a.idCategoria)}
                      </Badge>
                    </td>
                    <td data-label="Entrenador" className="px-4 py-3 text-sm text-gray-600">
                      {getEntrenadorNombreByCategoria(a.idCategoria)}
                    </td>
                    <td data-label="Fecha carga" className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(a.fechaCargado)}
                    </td>
                    <td data-label="Acciones" className="px-4 py-3 flex gap-1">
                      <button className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs rounded-md transition-colors">Ver</button>
                      <button onClick={() => eliminar(a.id)} className="px-3 py-1.5 border border-red-200 text-club-red text-xs rounded-md hover:bg-red-50 transition-colors">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Mostrando {total} de {total} registros</p>
        </div>
      </div>
    </div>
  );
}
