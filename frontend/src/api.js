import axios from 'axios'

const API_BASE = 'http://localhost:8000/api'

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add JWT token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiry and refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (refresh) {
          const res = await axios.post(`${API_BASE}/auth/refresh/`, { refresh })
          localStorage.setItem('access_token', res.data.access)
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`
          return api(originalRequest)
        }
      } catch (err) {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (username, password) => api.post('/auth/register/', { username, password }),
  login: (username, password) => api.post('/auth/login/', { username, password }),
  refresh: (refresh) => api.post('/auth/refresh/', { refresh })
}

export const taskAPI = {
  list: (params = {}) => api.get('/tasks/', { params }),
  create: (data) => api.post('/tasks/', data),
  retrieve: (id) => api.get(`/tasks/${id}/`),
  update: (id, data) => api.put(`/tasks/${id}/`, data),
  partialUpdate: (id, data) => api.patch(`/tasks/${id}/`, data),
  delete: (id) => api.delete(`/tasks/${id}/`)
}

export default api
