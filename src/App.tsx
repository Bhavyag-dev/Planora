import React, { useState, useEffect } from 'react';
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

function PrivateRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/events" />;

  return <>{children}</>;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Landing />;
  
  if (user.role === 'super_admin' || user.role === 'admin') return <Navigate to="/super-admin" />;
  if (user.role === 'college_admin') return <Navigate to="/college-admin" />;
  if (user.role === 'dept_admin') return <Navigate to="/dept-admin" />;
  
  return <Navigate to="/events" />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 font-sans text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/events" element={<DashboardLayout><Events /></DashboardLayout>} />
          <Route path="/events/:id" element={<DashboardLayout><EventDetails /></DashboardLayout>} />
          
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
            path="/dept-admin" 
            element={
              <PrivateRoute roles={['dept_admin']}>
                <DashboardLayout><DeptAdminDashboard /></DashboardLayout>
              </PrivateRoute>
            } 
          />

          <Route 
            path="/admin/events/:eventId/participants" 
            element={
              <PrivateRoute roles={['college_admin', 'dept_admin']}>
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
              <PrivateRoute roles={['super_admin', 'admin', 'college_admin', 'dept_admin']}>
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
          
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}
