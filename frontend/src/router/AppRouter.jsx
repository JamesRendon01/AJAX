import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import authService from "../services/authService";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import Entrenadores from "../pages/entrenadores/Entrenadores";
import Grupos from "../pages/grupos/Grupos";
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/entrenadores" element={<PrivateRoute><Entrenadores /></PrivateRoute>} />
        <Route path="/grupos" element={<PrivateRoute><Grupos /></PrivateRoute>} />
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