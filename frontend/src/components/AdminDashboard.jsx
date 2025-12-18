import { TaskList } from './TaskList'

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
          <p className="font-semibold text-yellow-800">👑 Admin View</p>
          <p className="text-sm text-yellow-700">You can view and manage all tasks from all users</p>
        </div>
        <TaskList isAdmin={true} />
      </div>
    </div>
  )
}
