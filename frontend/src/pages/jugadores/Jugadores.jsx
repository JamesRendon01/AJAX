import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { mockJugadores, mockCategorias } from "../../mock/data";

const catColor = { Rojo: "bg-red-100 text-red-700", Azul: "bg-blue-100 text-blue-700", Blanco: "bg-gray-200 text-gray-600" };

export default function Jugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [catFiltro, setCatFiltro] = useState("todas");
  const [anioFiltro, setAnioFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  useEffect(() => {
    setTimeout(() => setJugadores(mockJugadores), 300);
  }, []);

  const filtrados = jugadores.filter((j) => {
    const matchBusqueda = j.nombre.toLowerCase().includes(busqueda.toLowerCase()) || j.documento.includes(busqueda);
    const matchCat = catFiltro === "todas" || j.categoria === catFiltro;
    const matchAnio = anioFiltro === "todos" || j.anio === Number(anioFiltro);
    const matchEstado = estadoFiltro === "todos" || j.estado === estadoFiltro;
    return matchBusqueda && matchCat && matchAnio && matchEstado;
  });

  const total = jugadores.length;
  const porCat = (cat) => jugadores.filter((j) => j.categoria === cat).length;

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Deportistas</h1>
            <p className="text-sm text-gray-500 mt-0.5">Lista general de todos los deportistas del club</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-sm px-4 py-2.5 rounded-lg transition-colors">
              Exportar
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
              + Agregar
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total</p>
              <p className="text-blue-500 text-3xl font-medium">{total}</p>
            </div>
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Cat. Rojo</p>
              <p className="text-red-400 text-3xl font-medium">{porCat("Rojo")}</p>
            </div>
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Cat. Azul</p>
              <p className="text-blue-400 text-3xl font-medium">{porCat("Azul")}</p>
            </div>
            <div className="bg-[#2d2d2d] rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Cat. Blanco</p>
              <p className="text-gray-400 text-3xl font-medium">{porCat("Blanco")}</p>
            </div>
          </div>

          {/* Filtros */}
          <input type="text" placeholder="Buscar por nombre o documento..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#2d2d2d] text-gray-300 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />

          <div className="grid grid-cols-3 gap-3 mb-4">
            <select value={catFiltro} onChange={(e) => setCatFiltro(e.target.value)}
              className="bg-[#2d2d2d] text-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none">
              <option value="todas">Todas las categorías</option>
              <option value="Rojo">Categoría Rojo</option>
              <option value="Azul">Categoría Azul</option>
              <option value="Blanco">Categoría Blanco</option>
            </select>
            <select value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)}
              className="bg-[#2d2d2d] text-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none">
              <option value="todos">Todos los años</option>
              <option value="2025">2025</option>
            </select>
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}
              className="bg-[#2d2d2d] text-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none">
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Tabla */}
          <div className="bg-[#2d2d2d] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  {["Nombre", "Documento", "Categoría", "Entrenador", "Dorsal", "Estado", "Acciones"].map((h) => (
                    <th key={h} className="text-gray-400 text-sm font-normal text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((j) => (
                  <tr key={j.id} className="border-b border-gray-700 last:border-0">
                    <td className="text-white text-sm px-4 py-4 font-medium">{j.nombre}</td>
                    <td className="text-gray-300 text-sm px-4 py-4">{j.documento}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-md ${catColor[j.categoria]}`}>
                        {j.categoria}<br/>{j.anio}
                      </span>
                    </td>
                    <td className="text-gray-300 text-sm px-4 py-4">{j.entrenador}</td>
                    <td className="text-gray-300 text-sm px-4 py-4">{j.dorsal}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${j.estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {j.estado === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                      <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-xs px-3 py-1.5 rounded-md">Ver</button>
                      <button className="bg-[#3a3a3a] hover:bg-[#444] border border-gray-600 text-gray-200 text-xs px-3 py-1.5 rounded-md">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-gray-500 text-sm px-4 py-3">Mostrando {filtrados.length} de {total} deportistas</p>
          </div>
        </div>
      </div>
    </div>
  );
}