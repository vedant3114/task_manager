import { useState, useEffect } from 'react'
import { taskAPI } from '../api'
import { TaskForm } from './TaskForm'

export const TaskList = ({ isAdmin }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ search: '', status: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [filters, page])

  const fetchTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, ...filters }
      if (params.status === '') delete params.status
      const res = await taskAPI.list(params)
      const data = res.data
      setTasks(data.results || data)
      setTotalPages(Math.ceil((data.count || data.length) / 10))
    } catch (err) {
      setError('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskAPI.delete(id)
        setTasks(tasks.filter(t => t.id !== id))
      } catch (err) {
        setError('Failed to delete task')
      }
    }
  }

  const handleSaveTask = async () => {
    await fetchTasks()
    setShowForm(false)
    setEditingId(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + New Task
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {showForm && (
        <TaskForm
          taskId={editingId}
          onClose={() => { setShowForm(false); setEditingId(null) }}
          onSave={handleSaveTask}
        />
      )}

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1) }}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.status}
          onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1) }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="false">Open</option>
          <option value="true">Completed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-gray-500">No tasks found</div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md">
              <div className="flex-1">
                <h3 className={`font-semibold ${task.status ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </h3>
                {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Owner: {task.owner} | {task.status ? 'Completed' : 'Open'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingId(task.id); setShowForm(true) }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Prev
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  )
}
