import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage";
import EditProjectPage from "@/pages/EditProjectPage";
import TeamMembersPage from "@/pages/TeamMembersPage";
import TasksPage from "@/pages/TasksPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/projects/edit/:id" element={<EditProjectPage />} />
        <Route path="/projects/:id/team" element={<TeamMembersPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
