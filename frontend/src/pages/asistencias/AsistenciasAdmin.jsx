import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import asistenciaService from "../../services/asistenciaAdminService";
import api from "../../services/api";
import { FileText } from "lucide-react";

function Badge({ children, color }) {
  const colors = {
    rojo: { bg: "#FCEBEB", color: "#A32D2D" },
    azul: { bg: "#E6F1FB", color: "#0C447C" },
    blanco: { bg: "#F1EFE8", color: "#5F5E5A" },
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
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-sm">Cargando...</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-start border-b border-gray-200">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Asistencias</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Historial general de asistencias subidas por todos los entrenadores
            </p>
          </div>
          <button className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
            Exportar
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-4 gap-2.5 mb-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-gray-500 text-xs mb-1">Total archivos</p>
              <p className="text-blue-600 text-2xl font-medium">{total}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-gray-500 text-xs mb-1">Cat. Rojo</p>
              <p className="text-red-500 text-2xl font-medium">{catRojo}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-gray-500 text-xs mb-1">Cat. Azul</p>
              <p className="text-blue-600 text-2xl font-medium">{catAzul}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-gray-500 text-xs mb-1">Cat. Blanco</p>
              <p className="text-gray-500 text-2xl font-medium">{catBlanco}</p>
            </div>
          </div>

          <div className="flex gap-2.5 mb-4 flex-wrap">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="flex-1 min-w-[180px] max-w-[260px] px-3 py-2 border border-gray-200 rounded-lg text-sm"
              value={filtros.search}
              onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
            />
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              value={filtros.idCategoria}
              onChange={(e) => setFiltros({ ...filtros, idCategoria: e.target.value })}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre} {c.ano}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              value={filtros.idEntrenador}
              onChange={(e) => setFiltros({ ...filtros, idEntrenador: e.target.value })}
            >
              <option value="">Todos los entrenadores</option>
              {entrenadores.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              value={filtros.mes}
              onChange={(e) => setFiltros({ ...filtros, mes: e.target.value })}
            >
              <option value="">Todos los meses</option>
              {meses.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 w-[22%]">Nombre archivo</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 w-[16%]">Categoría</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 w-[18%]">Entrenador</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 w-[16%]">Fecha carga</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 w-[16%]">Fecha creación</th>
                  <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-500 w-[12%]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t border-gray-100">
                    <td className="px-3 py-2.5 text-sm text-gray-800 flex items-center gap-2">
                      <FileText size={14} className="text-blue-600" />
                      {a.nombre}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge color={getCategoriaColor(a.idCategoria)}>
                        {getCategoriaNombre(a.idCategoria)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-500">
                      {getEntrenadorNombreByCategoria(a.idCategoria)}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-500">
                      {formatDate(a.fechaCargado)}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-500">
                      {formatDate(a.fechaCreacion)}
                    </td>
                    <td className="px-3 py-2.5 flex gap-1">
                      <button className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200">Ver</button>
                      <button onClick={() => eliminar(a.id)} className="px-2 py-1 border border-red-200 text-red-600 text-xs rounded hover:bg-red-50">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2.5">Mostrando {total} de {total} registros</p>
        </div>
      </div>
    </div>
  );
}