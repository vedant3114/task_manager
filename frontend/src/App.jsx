import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navigation } from './components/Navigation'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { TaskList } from './components/TaskList'
import { AdminDashboard } from './components/AdminDashboard'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskList isAdmin={false} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Navigate to="/tasks" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
