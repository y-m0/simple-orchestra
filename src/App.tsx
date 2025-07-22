import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import GlobalErrorBoundary from '@/components/error/GlobalErrorBoundary';

// Landing and Auth Pages (immediate load)
import Index from '@/pages/Index';
import Login from '@/pages/Login';

// Lazy loaded pages for code splitting
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Dashboard = lazy(() => import('@/pages/Dashboard-working'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const WorkflowBuilder = lazy(() => import('@/pages/WorkflowBuilder'));
const Tools = lazy(() => import('@/pages/Tools'));
const Settings = lazy(() => import('@/pages/Settings'));
const ActivityLog = lazy(() => import('@/pages/ActivityLog'));
const AgentDirectory = lazy(() => import('@/pages/AgentDirectory'));
const ApprovalsInbox = lazy(() => import('@/pages/ApprovalsInbox'));
const SwarmControlPanel = lazy(() => import('@/pages/SwarmControlPanel'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Loading component with better accessibility
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="sr-only">Loading page...</span>
  </div>
);

function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <AuthProvider>
            <Router>
              {/* Skip to main content link for accessibility */}
              <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded z-50"
              >
                Skip to main content
              </a>
              
              <main id="main-content">
                <Suspense fallback={<PageLoader />}>
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
                  
                  <Route path="/swarm" element={
                    <ProtectedRoute>
                      <SwarmControlPanel />
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
                </Suspense>
              </main>
            </Router>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}

export default App;