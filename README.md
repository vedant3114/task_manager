# Task Manager

A simple full-stack Task Manager application with a Django REST backend and a React (Vite) frontend.

---

## Tech stack
- Backend: Django 5, Django REST Framework
- Auth: JSON Web Tokens (Simple JWT)
- Frontend: React + Vite
- Deployment: Render (backend) and Vercel (frontend)

---

## Repository structure
- `manage.py` — Django management
- `task_manager/` — Django project
- `accounts/` — user registration/auth app
- `tasks/` — tasks API
- `frontend/` — React + Vite frontend
- `requirements.txt` — Python dependencies

---

## Local setup
1. Clone the repo:

   ```bash
   git clone https://github.com/vedant3114/task_manager.git
   cd task_manager
   ```

2. Create and activate a Python virtual environment:

   ```bash
   python -m venv env
   env\Scripts\activate    # Windows
   # OR
   source env/bin/activate   # macOS / Linux
   ```

3. Install backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations and create a superuser:

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. Collect static files (for production/static testing):

   ```bash
   python manage.py collectstatic --noinput
   ```

6. Run the Django development server:

   ```bash
   python manage.py runserver
   ```

7. Frontend (in a separate terminal):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The frontend expects the backend API at `http://localhost:8000/api` by default.

---

## Frontend: configure API base URL for production
The frontend currently uses `frontend/src/api.js` with a hard-coded `API_BASE`. Update it to read an environment variable when building for production. Replace the top of `frontend/src/api.js` with:

```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
```

When deploying to Vercel, set the environment variable `VITE_API_BASE` to your backend URL (for example `https://task-manager-backend-xxxx.onrender.com/api`).

Vercel settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_BASE` = `<your-backend-url>/api`

---

## Deploying backend to Render.com (recommended)
Use these values when creating a new **Web Service** on Render:

- Name: `task-manager-backend`
- Environment: Python 3
- Branch: `main`
- Build Command:

  ```bash
  pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
  ```

- Start Command:

  ```bash
  gunicorn task_manager.wsgi:application --bind 0.0.0.0:$PORT --workers 1
  ```

- Add environment variables (Render dashboard → Environment):
  - `SECRET_KEY` — generate a secure value
  - `DEBUG` = `False`
  - `PYTHON_VERSION` = `3.11`
  - `FRONTEND_URL` = your Vercel frontend URL (optional)

Notes:
- The repo currently uses SQLite (`db.sqlite3`). SQLite is not suitable for production on Render because the filesystem is ephemeral. For persistent data, provision a managed PostgreSQL instance on Render and set `DATABASE_URL`. Update `task_manager/settings.py` to read `DATABASE_URL` (use `dj-database-url` or manual configuration).

Example for Postgres (install `dj-database-url` and `psycopg-binary`):

```python
# in settings.py
import dj_database_url
DATABASES = {
  'default': dj_database_url.config(default=os.environ.get('DATABASE_URL'))
}
```

After changing DB config, add the production DB credentials to Render as `DATABASE_URL`.

---

## Environment variables summary
- `SECRET_KEY` (string) — required for Django production
- `DEBUG` (True|False) — set to `False` in production
- `DATABASE_URL` — optional, set when using Postgres in production
- `VITE_API_BASE` — frontend build-time env pointing to backend API (include `/api` suffix)

---

## Running tests
If the project includes Django tests, run:

```bash
python manage.py test
```

---

## Troubleshooting
- Build fails because `requirements.txt` path or markdown links were used: ensure the Render build command uses plain text: `pip install -r requirements.txt` not markdown link format.
- If Collectstatic fails, check `STATIC_ROOT` in `task_manager/settings.py` and ensure `whitenoise` is installed.
- If migrations don't persist on Render, switch to a managed DB (Postgres) and set `DATABASE_URL`.

---

## Contributing
Feel free to open issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

---

## License
Specify a license if you want (MIT, Apache-2.0, etc.).

---

If you want, I can also:
- Commit this `README.md` to the repo and push it for you
- Update `frontend/src/api.js` automatically to use `VITE_API_BASE`
- Add `dj-database-url` and a sample production DB config to `settings.py`

Which of those would you like me to do next?
