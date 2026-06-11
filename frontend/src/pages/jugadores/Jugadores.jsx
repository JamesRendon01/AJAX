import { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { mockJugadores } from "../../mock/data";

const catColor = { Rojo: "bg-red-50 text-red-700 border-red-200", Azul: "bg-blue-50 text-blue-700 border-blue-200", Blanco: "bg-gray-100 text-gray-600 border-gray-200" };

function getBadge(cat) {
  return catColor[cat] || "bg-gray-100 text-gray-600 border-gray-200";
}

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-club-blue">Deportistas</h1>
            <p className="text-sm text-gray-500 mt-0.5">Lista general de todos los deportistas del club</p>
          </div>
          <div className="flex gap-2">
            <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-sm px-4 py-2.5 rounded-lg transition-colors">
              Exportar
            </button>
            <button className="bg-club-blue hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg">
              + Agregar
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
              <p className="text-gray-500 text-sm font-medium mb-1">Cat. Rojo</p>
              <p className="text-club-red text-3xl font-bold">{porCat("Rojo")}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Cat. Azul</p>
              <p className="text-club-blue text-3xl font-bold">{porCat("Azul")}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-gray-500 text-sm font-medium mb-1">Cat. Blanco</p>
              <p className="text-gray-600 text-3xl font-bold">{porCat("Blanco")}</p>
            </div>
          </div>

          <input type="text" placeholder="Buscar por nombre o documento..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-club-blue focus:border-transparent" />

          <div className="grid grid-cols-3 gap-3 mb-6">
            <select value={catFiltro} onChange={(e) => setCatFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue">
              <option value="todas">Todas las categorías</option>
              <option value="Rojo">Categoría Rojo</option>
              <option value="Azul">Categoría Azul</option>
              <option value="Blanco">Categoría Blanco</option>
            </select>
            <select value={anioFiltro} onChange={(e) => setAnioFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue">
              <option value="todos">Todos los años</option>
              <option value="2025">2025</option>
            </select>
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}
              className="border border-gray-200 bg-white text-gray-600 text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-blue">
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Nombre", "Documento", "Categoría", "Entrenador", "Dorsal", "Estado", "Acciones"].map((h) => (
                    <th key={h} className="text-gray-600 text-sm font-semibold text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((j, i) => (
                  <tr key={j.id} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="text-gray-800 text-sm px-4 py-4 font-medium">{j.nombre}</td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.documento}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getBadge(j.categoria)}`}>
                        {j.categoria}<br/>{j.anio}
                      </span>
                    </td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.entrenador}</td>
                    <td className="text-gray-600 text-sm px-4 py-4">{j.dorsal}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        j.estado === "activo"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {j.estado === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex gap-2">
                      <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs px-3 py-1.5 rounded-md transition-colors">Ver</button>
                      <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-club-blue text-xs px-3 py-1.5 rounded-md transition-colors">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-gray-400 text-sm px-4 py-3 border-t border-gray-100">Mostrando {filtrados.length} de {total} deportistas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
