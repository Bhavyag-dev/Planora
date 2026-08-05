import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { MyRegistrations } from './pages/MyRegistrations';
import { DashboardLayout } from './components/DashboardLayout';
import { Landing } from './pages/Landing';
import { Settings } from './pages/Settings';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './auth/AuthProvider';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { Dashboard } from './pages/Dashboard';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}

function PageWithLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  return <div className="min-h-screen bg-zinc-950 text-white">{children}</div>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <WorkspaceProvider>
          <div className="min-h-screen bg-zinc-950 font-sans text-white">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Unified space routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />

              <Route path="/events" element={<PageWithLayout><Events /></PageWithLayout>} />
              <Route path="/events/:id" element={<PageWithLayout><EventDetails /></PageWithLayout>} />

              <Route
                path="/my-registrations"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <MyRegistrations />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </WorkspaceProvider>
      </AuthProvider>
    </Router>
  );
}
