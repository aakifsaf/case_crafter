import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect } from 'react'
import { useAuthStore } from './stores/useAuthStore'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProjectList } from './components/projects/ProjectList'
import { ProjectDetail } from './components/projects/ProjectDetail'
import { DocumentList } from './components/documents/DocumentList'
import { TestSuiteView } from './components/test-cases/TestSuiteView'
import { DocumentManager } from './components/documents/DocumentManager'
import { ProjectSettings } from './components/projects/ProjectSettings'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectList />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects/:projectId" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectDetail />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects/:projectId/documents" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DocumentManager />
                  </Layout>
                 </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects/:projectId/test-suite" 
              element={
               <ProtectedRoute>
                  <Layout>
                    <TestSuiteView />
                  </Layout>
               </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects/:projectId/settings" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectSettings />
                  </Layout>
                 </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App