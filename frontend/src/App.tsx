import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import SettingsPage from "./pages/admin/SettingsPage";
import SkillsAdminPage from "./pages/admin/SkillsAdminPage";
import JobsAdminPage from "./pages/admin/JobsAdminPage";
import EducationAdminPage from "./pages/admin/EducationAdminPage";
import CertsAdminPage from "./pages/admin/CertsAdminPage";
import ProjectsAdminPage from "./pages/admin/ProjectsAdminPage";
import MessagesAdminPage from "./pages/admin/MessagesAdminPage";
import RequireAuth from "./pages/admin/RequireAuth";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="skills" element={<SkillsAdminPage />} />
        <Route path="jobs" element={<JobsAdminPage />} />
        <Route path="education" element={<EducationAdminPage />} />
        <Route path="certifications" element={<CertsAdminPage />} />
        <Route path="projects" element={<ProjectsAdminPage />} />
        <Route path="messages" element={<MessagesAdminPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
