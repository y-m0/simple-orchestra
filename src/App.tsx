import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Landing and Auth Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Onboarding from '@/pages/Onboarding';

// Main App Pages
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import WorkflowBuilder from '@/pages/WorkflowBuilder';
import Tools from '@/pages/Tools';
import Settings from '@/pages/Settings';
import ActivityLog from '@/pages/ActivityLog';
import AgentDirectory from '@/pages/AgentDirectory';
import ApprovalsInbox from '@/pages/ApprovalsInbox';

// Simple Pages (fallback)
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="orchestration-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/workflow-builder" element={
                <ProtectedRoute>
                  <WorkflowBuilder />
                </ProtectedRoute>
              } />
              
              <Route path="/tools" element={
                <ProtectedRoute>
                  <Tools />
                </ProtectedRoute>
              } />
              
              <Route path="/activity" element={
                <ProtectedRoute>
                  <ActivityLog />
                </ProtectedRoute>
              } />
              
              <Route path="/agents" element={
                <ProtectedRoute>
                  <AgentDirectory />
                </ProtectedRoute>
              } />
              
              <Route path="/approvals" element={
                <ProtectedRoute>
                  <ApprovalsInbox />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;