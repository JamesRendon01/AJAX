import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import authService from "../services/authService";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Entrenadores from "../pages/entrenadores/Entrenadores";
import Categorias from "../pages/categorias/Categorias";
import DashboardEntrenador from "../pages/entrenadores/DashboardEntrenador";
import AsistenciasEntrenador from "../pages/entrenadores/Asistencias";
import AsistenciasAdmin from "../pages/asistencias/AsistenciasAdmin";
import Planeaciones from "../pages/entrenadores/Planeaciones";
import PlaneacionesAdmin from "../pages/planeaciones/Planeaciones";
import Jugadores from "../pages/jugadores/Jugadores";
import MisJugadores from "../pages/entrenadores/MisJugadores";

function PrivateRoute({ children }) {
  if (!authService.isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  if (authService.isAuthenticated()) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/entrenadores" element={<PrivateRoute><Entrenadores /></PrivateRoute>} />
        <Route path="/categorias" element={<PrivateRoute><Categorias /></PrivateRoute>} />
        <Route path="/asistencias" element={<PrivateRoute><AsistenciasAdmin /></PrivateRoute>} />
        <Route path="/planeaciones" element={<PrivateRoute><PlaneacionesAdmin /></PrivateRoute>} />
        <Route path="/entrenador/dashboard" element={<PrivateRoute><DashboardEntrenador /></PrivateRoute>} />
        <Route path="/entrenador/asistencias" element={<PrivateRoute><AsistenciasEntrenador /></PrivateRoute>} />
        <Route path="/entrenador/planeaciones" element={<PrivateRoute><Planeaciones /></PrivateRoute>} />
        <Route path="/jugadores" element={<PrivateRoute><Jugadores /></PrivateRoute>} />
        <Route path="/entrenador/jugadores" element={<PrivateRoute><MisJugadores /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}