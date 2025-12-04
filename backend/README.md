# Backend Setup & Run Instructions

## Quick Start

### 1. Setup Virtual Environment
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Configure Environment
```powershell
copy .env.example .env
```

Edit `.env` file with your settings:
```
DATABASE_URL=sqlite:///./tasks.db
SECRET_KEY=change-this-to-a-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

### 4. Seed Database (Optional but Recommended)
```powershell
python seed_data.py
```

This creates:
- Demo user (username: demo, password: demo123)
- 10 sample tasks

### 5. Run the Server
```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: **http://localhost:8000**

- API Documentation: http://localhost:8000/api/docs
- Alternative Docs: http://localhost:8000/api/redoc

## API Endpoints

All endpoints are prefixed with `/api`

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user (requires auth)

### Tasks
- GET `/api/tasks/` - List tasks with pagination/filters (requires auth)
- GET `/api/tasks/{id}` - Get single task (requires auth)
- POST `/api/tasks/` - Create task (requires auth)
- PUT `/api/tasks/{id}` - Update task (requires auth)
- DELETE `/api/tasks/{id}` - Delete task (requires auth)

## Testing with cURL

### Register
```powershell
curl -X POST "http://localhost:8000/api/auth/register" -H "Content-Type: application/json" -d '{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"password123\"}'
```

### Login
```powershell
curl -X POST "http://localhost:8000/api/auth/login" -H "Content-Type: application/json" -d '{\"username\":\"demo\",\"password\":\"demo123\"}'
```

### Create Task
```powershell
curl -X POST "http://localhost:8000/api/tasks/" -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{\"title\":\"Test Task\",\"priority\":\"High\"}'
```

## Database Migrations (Alembic)

### Initialize Alembic (Already Done)
```powershell
alembic init alembic
```

### Create Migration
```powershell
alembic revision --autogenerate -m "Description of changes"
```

### Run Migrations
```powershell
alembic upgrade head
```

### Rollback Migration
```powershell
alembic downgrade -1
```

## Troubleshooting

### Port Already in Use
```powershell
# Change port
python -m uvicorn app.main:app --reload --port 8001
```

### Database Locked
```powershell
# Delete database and reseed
rm tasks.db
python seed_data.py
```

### Import Errors
```powershell
# Make sure virtual environment is activated
.\venv\Scripts\activate
pip install -r requirements.txt
```
