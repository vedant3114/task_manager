# Task Manager Frontend Setup

## Installation

```bash
cd frontend
npm install
```

## Development

Start the frontend dev server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy API calls to `http://localhost:8000/api`.

## Build

```bash
npm run build
```

This creates an optimized production build in `dist/`.

## Features

- **Authentication**: JWT-based login/register with automatic token refresh
- **Task Management**: Create, read, update, delete tasks
- **Filtering & Search**: Filter by status, search by title/description
- **Pagination**: Navigate through task pages (10 per page)
- **Role-Based Access**: Admin users see all tasks; regular users see only their own
- **Responsive Design**: Built with TailwindCSS for mobile/tablet/desktop

## Project Structure

```
frontend/
├── src/
│   ├── api.js                    # Axios API client with JWT interceptors
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state management
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskForm.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Navigation.jsx
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx                   # Main router setup
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## API Integration

The frontend calls the following backend endpoints:

- `POST /api/auth/register/` — User registration
- `POST /api/auth/login/` — Login (returns access + refresh tokens)
- `POST /api/auth/refresh/` — Refresh access token
- `GET /api/tasks/` — List tasks (with filtering/search/pagination)
- `POST /api/tasks/` — Create task
- `GET /api/tasks/{id}/` — Retrieve task
- `PUT /api/tasks/{id}/` — Update task
- `PATCH /api/tasks/{id}/` — Partial update
- `DELETE /api/tasks/{id}/` — Delete task

## Environment

The frontend is configured to use:
- Development: `http://localhost:8000/api` (proxied via Vite)
- Vite dev server: `http://localhost:5173`

For production, update `api.js` or use `.env` file to change `API_BASE`.
