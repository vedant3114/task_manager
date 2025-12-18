import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Navigation = () => {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">📋 Task Manager</Link>
        {user ? (
          <div className="flex items-center gap-6">
            <span className="text-sm">
              Welcome, <strong>{user.username}</strong>
              {isAdmin && <span className="ml-2 bg-red-500 px-2 py-1 rounded text-xs">Admin</span>}
            </span>
            <Link to="/tasks" className="hover:underline">Tasks</Link>
            {isAdmin && <Link to="/admin" className="hover:underline">Admin</Link>}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
