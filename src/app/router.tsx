import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RouteLoadingFallback } from '../components/feedback/RouteLoadingFallback';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthenticatedLayout } from '../components/layout/AuthenticatedLayout';
import { GuestLayout } from '../components/layout/GuestLayout';
import { GuestRoute, ProtectedRoute } from '../components/navigation/routeGuards';
import { DashboardPage } from '../pages/DashboardPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProjectDetailsPage } from '../pages/ProjectDetailsPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TaskDetailsPage } from '../pages/TaskDetailsPage';
import { TasksPage } from '../pages/TasksPage';

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback label="Loading route" />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route element={<GuestLayout />}>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
