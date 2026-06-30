import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import FacultyListPage from "./pages/FacultyListPage";
import FacultyStatusPage from "./pages/FacultyStatusPage";
import LabListPage from "./pages/LabListPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated — any role */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/faculty"
            element={<ProtectedRoute><FacultyListPage /></ProtectedRoute>}
          />
          <Route
            path="/labs"
            element={<ProtectedRoute><LabListPage /></ProtectedRoute>}
          />

          {/* Faculty only: self-service status */}
          <Route
            path="/my-status"
            element={
              <ProtectedRoute allowedRoles={["FACULTY"]}>
                <FacultyStatusPage />
              </ProtectedRoute>
            }
          />

          {/* Admin only: management panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
