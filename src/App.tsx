import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { CollegeAdminDashboard } from './pages/CollegeAdminDashboard';
import { DeptAdminDashboard } from './pages/DeptAdminDashboard';
import { ParticipantsList } from './pages/ParticipantsList';
import { MyRegistrations } from './pages/MyRegistrations';
import { CheckIn } from './pages/CheckIn';
import { DashboardLayout } from './components/DashboardLayout';
import { Landing } from './pages/Landing';
import { Settings } from './pages/Settings';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './auth/AuthProvider';
import { Dashboard } from './pages/Dashboard';
import { ThemeLab } from './pages/ThemeLab';
import { CollegeHome } from './pages/CollegeHome';
import { getPostLoginRoute } from './auth/postLoginRoute';

function PrivateRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/events" />;

  return <>{children}</>;
}

function StudentEventsRoute() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (isAuthenticated && user && user.role !== 'student') {
    return <Navigate to={getPostLoginRoute(user)} replace />;
  }

  if (isAuthenticated && user?.role === 'student') {
    return (
      <DashboardLayout>
        <Events />
      </DashboardLayout>
    );
  }

  return <Events />;
}

function StudentEventDetailsRoute() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (isAuthenticated && user && user.role !== 'student') {
    return <Navigate to={getPostLoginRoute(user)} replace />;
  }

  if (isAuthenticated && user?.role === 'student') {
    return (
      <DashboardLayout>
        <EventDetails />
      </DashboardLayout>
    );
  }

  return <EventDetails />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-zinc-950 font-sans text-white">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/college/:slug" element={<CollegeHome />} />
            <Route path="/theme-lab" element={<DashboardLayout><ThemeLab /></DashboardLayout>} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute roles={['student']}>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route path="/events" element={<StudentEventsRoute />} />
            <Route path="/events/:id" element={<StudentEventDetailsRoute />} />

            <Route
              path="/super-admin"
              element={
                <PrivateRoute roles={['super_admin', 'admin']}>
                  <DashboardLayout><SuperAdminDashboard /></DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/college-admin"
              element={
                <PrivateRoute roles={['college_admin']}>
                  <DashboardLayout><CollegeAdminDashboard /></DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/department-admin"
              element={
                <PrivateRoute roles={['dept_admin', 'spec_admin']}>
                  <DashboardLayout><DeptAdminDashboard /></DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/events/:eventId/participants"
              element={
                <PrivateRoute roles={['college_admin', 'dept_admin', 'spec_admin']}>
                  <DashboardLayout><ParticipantsList /></DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/my-registrations"
              element={
                <PrivateRoute roles={['student']}>
                  <DashboardLayout><MyRegistrations /></DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/check-in"
              element={
                <PrivateRoute roles={['super_admin', 'admin', 'college_admin', 'dept_admin', 'spec_admin']}>
                  <DashboardLayout><CheckIn /></DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <DashboardLayout><Settings /></DashboardLayout>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
