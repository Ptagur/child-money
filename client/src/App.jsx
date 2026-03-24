import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ParentDashboard from './pages/ParentDashboard'
import ChildDashboard from './pages/ChildDashboard'
import ProfilePage from './pages/ProfilePage'
import './index.css'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />

  return children
}

function App() {
  return (
    <ThemeProvider> {/* Wrapped AuthProvider with ThemeProvider */}
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route 
                path="/parent/*" 
                element={
                  <ProtectedRoute allowedRoles={['parent']}>
                    <ParentDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/child/*" 
                element={
                  <ProtectedRoute allowedRoles={['child']}>
                    <ChildDashboard />
                  </ProtectedRoute>
                } 
              />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['parent', 'child']}>
                  <div className="flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
                    {/* Dynamic Sidebar based on role would go here, but usually Profile is accessed within the dash. 
                        Let's keep it simple: profile is for current user. 
                     */}
                     {/* For a better UX, I'll redirect to /parent/profile or /child/profile if needed, 
                         but I'll just add it to the subroutes in the dashboards. */}
                  </div>
                </ProtectedRoute>
              } 
            />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
