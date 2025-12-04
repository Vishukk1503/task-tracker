# Task Tracker - Production-Ready To-Do Application

A modern, full-stack task management application with clean architecture, built with **Next.js 14** (frontend) and **FastAPI** (backend).

## 🌟 Features

### Core Functionality
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete tasks
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 🔍 **Search & Filter** - Search by title/description, filter by status and priority
- 📊 **Sort & Pagination** - Sort by multiple fields, paginated results
- ⚡ **Real-time Updates** - Instant UI updates with React Query
- 📱 **Fully Responsive** - Mobile-first, works on all screen sizes
- 🎨 **Dark Mode** - Beautiful dark/light theme toggle
- 📈 **Analytics Dashboard** - Real-time KPIs and performance metrics

### Task Features
- **Status Tracking**: Not Started, In Progress, Completed
- **Priority Levels**: Low, Medium, High
- **Start & Due Dates**: Track when tasks begin and should complete
- **Rich Descriptions**: Detailed task information
- **Visual Indicators**: Color-coded priorities and statuses
- **Due Date Alerts**: Warnings for overdue and upcoming tasks
- **Kanban Board**: Drag-and-drop tasks between status columns
- **Inline Editing**: Double-click task titles to edit
- **Confetti Celebration**: Animation when completing tasks

### Technical Features
- 🏗️ Clean Architecture with separation of concerns
- 🎨 Modern UI with TailwindCSS + shadcn/ui components
- 🔄 Optimistic updates for better UX
- 🍞 Toast notifications for all actions
- 📝 Input validation on frontend and backend
- 🔒 CORS and security middleware
- 📦 SQLite database (easily switchable to PostgreSQL/MySQL)
- 🧪 Type-safe with TypeScript

---

## 📁 Project Structure

```
To-Do/
├── backend/                     # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── auth.py     # Authentication routes
│   │   │   │   └── tasks.py    # Task CRUD routes
│   │   │   └── dependencies.py  # JWT auth dependency
│   │   ├── core/
│   │   │   ├── config.py        # Configuration
│   │   │   └── security.py      # JWT & password hashing
│   │   ├── db/
│   │   │   └── database.py      # Database connection
│   │   ├── models/
│   │   │   └── models.py        # SQLAlchemy models
│   │   ├── repositories/
│   │   │   └── repository.py    # Data access layer
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic schemas
│   │   ├── services/
│   │   │   └── service.py       # Business logic
│   │   └── main.py              # FastAPI app entry
│   ├── alembic/                 # Database migrations
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── seed_data.py            # Seed database script
│   └── .env.example
│
└── frontend/                    # Next.js Frontend
    ├── src/
    │   ├── app/
    │   │   ├── login/
    │   │   │   └── page.tsx     # Login page
    │   │   ├── register/
    │   │   │   └── page.tsx     # Registration page
    │   │   ├── layout.tsx       # Root layout
    │   │   ├── page.tsx         # Home/Dashboard
    │   │   ├── providers.tsx    # React Query & Auth providers
    │   │   └── globals.css      # Global styles
    │   ├── components/
    │   │   ├── ui/              # Reusable UI components
    │   │   │   ├── Badge.tsx
    │   │   │   ├── Button.tsx
    │   │   │   ├── Card.tsx
    │   │   │   ├── Dialog.tsx
    │   │   │   ├── Input.tsx
    │   │   │   └── Select.tsx
    │   │   ├── FilterBar.tsx    # Search & filter component
    │   │   ├── TaskCard.tsx     # Task display component
    │   │   ├── TaskDashboard.tsx # Main dashboard
    │   │   └── TaskForm.tsx     # Create/Edit task modal
    │   ├── contexts/
    │   │   └── AuthContext.tsx  # Authentication context
    │   └── lib/
    │       ├── api.ts           # API client & types
    │       └── utils.ts         # Utility functions
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── next.config.js
    └── .env.local
```

---

## 🗄️ Database Schema

### Users Table
```sql
- id: INTEGER (Primary Key)
- email: VARCHAR (Unique)
- username: VARCHAR (Unique)
- hashed_password: VARCHAR
- created_at: TIMESTAMP
```

### Tasks Table
```sql
- id: INTEGER (Primary Key)
- title: VARCHAR (Required)
- description: TEXT (Optional)
- status: ENUM (Not Started, In Progress, Completed)
- priority: ENUM (Low, Medium, High)
- due_date: TIMESTAMP (Optional)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- user_id: INTEGER (Foreign Key -> users.id)
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

#### POST /api/auth/register
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

#### POST /api/auth/login
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com"
  }
}
```

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks/` | List all tasks (paginated) | Yes |
| GET | `/api/tasks/{id}` | Get task by ID | Yes |
| POST | `/api/tasks/` | Create new task | Yes |
| PUT | `/api/tasks/{id}` | Update task | Yes |
| DELETE | `/api/tasks/{id}` | Delete task | Yes |

#### GET /api/tasks/
**Query Parameters:**
- `page` (default: 1): Page number
- `page_size` (default: 10): Items per page
- `search`: Search in title/description
- `status`: Filter by status
- `priority`: Filter by priority
- `sort_by`: Sort field (created_at, due_date, priority, status, title)
- `sort_order`: asc or desc

**Response:**
```json
{
  "tasks": [...],
  "total": 25,
  "page": 1,
  "page_size": 10,
  "total_pages": 3
}
```

#### POST /api/tasks/
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive docs",
  "status": "Not Started",
  "priority": "High",
  "due_date": "2025-12-15T10:00:00Z"
}
```

#### PUT /api/tasks/{id}
```json
{
  "status": "Completed"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend folder:**
```powershell
cd backend
```

2. **Create virtual environment:**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

3. **Install dependencies:**
```powershell
pip install -r requirements.txt
```

4. **Setup environment variables:**
```powershell
copy .env.example .env
```

Edit `.env` and update:
```
DATABASE_URL=sqlite:///./tasks.db
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

5. **Seed database with demo data:**
```powershell
python seed_data.py
```

6. **Run the backend server:**
```powershell
python -m uvicorn app.main:app --reload
```

Backend will run on: **http://localhost:8000**
- API Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### Frontend Setup

1. **Navigate to frontend folder:**
```powershell
cd frontend
```

2. **Install dependencies:**
```powershell
npm install
```

3. **Setup environment variables:**
```powershell
copy .env.local.example .env.local
```

Ensure `.env.local` contains:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. **Run the development server:**
```powershell
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🎮 Demo Credentials

After running the seed script, use these credentials:

**Username:** `demo`  
**Password:** `demo123`

The demo account comes with 10 pre-populated tasks showing various statuses and priorities.

---

## 🧪 Testing the Application

### Manual Testing Checklist

1. **Authentication:**
   - ✅ Register new user
   - ✅ Login with credentials
   - ✅ Logout
   - ✅ Protected routes redirect to login

2. **Task Creation:**
   - ✅ Create task with all fields
   - ✅ Create task with minimal fields
   - ✅ Validation errors display

3. **Task Reading:**
   - ✅ View all tasks
   - ✅ Search tasks
   - ✅ Filter by status
   - ✅ Filter by priority
   - ✅ Sort by different fields
   - ✅ Pagination works

4. **Task Updates:**
   - ✅ Edit task details
   - ✅ Change status
   - ✅ Change priority
   - ✅ Update due date

5. **Task Deletion:**
   - ✅ Delete task
   - ✅ Confirmation prompt

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL ORM
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **python-jose** - JWT tokens
- **passlib** - Password hashing
- **SQLite** - Database (production: PostgreSQL/MySQL)

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **Tanstack Query** - Data fetching & caching
- **Axios** - HTTP client
- **date-fns** - Date utilities
- **react-hot-toast** - Notifications
- **lucide-react** - Icons

---

## 🏗️ Architecture Patterns

### Backend Architecture (Clean Architecture)
```
Controllers (Routes) → Services (Business Logic) → Repositories (Data Access) → Models (Database)
```

- **Routes**: Handle HTTP requests/responses
- **Services**: Business logic and orchestration
- **Repositories**: Database operations
- **Models**: SQLAlchemy database models
- **Schemas**: Pydantic validation models

### Frontend Architecture
```
Pages → Components → API Client → Backend
```

- **Pages**: Next.js app router pages
- **Components**: Reusable UI components
- **Contexts**: Global state (Auth)
- **React Query**: Server state management
- **API Client**: Axios with interceptors

---

## 🔒 Security Features

1. **Password Hashing**: Bcrypt hashing for passwords
2. **JWT Authentication**: Secure token-based auth
3. **CORS**: Configured for frontend origin
4. **Input Validation**: Frontend and backend validation
5. **SQL Injection Protection**: SQLAlchemy ORM
6. **Token Expiration**: Configurable token lifetime

---

## 📈 Future Enhancements

- [ ] Task tags/categories
- [ ] Task comments/notes
- [ ] File attachments
- [ ] Task assignments (multi-user collaboration)
- [ ] Email notifications
- [ ] Task reminders
- [ ] Recurring tasks
- [ ] Task templates
- [ ] Export tasks (CSV, PDF)
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] WebSocket for real-time updates
- [ ] Activity log/audit trail

---

## 📝 License

This project is created for educational and demonstration purposes.

---

## 🤝 Contributing

Feel free to fork, modify, and use this project as a foundation for your own applications!

---

## 🚀 Deployment

This application is **production-ready** and configured for easy cloud deployment!

### Quick Deploy (Recommended)
Deploy to **Vercel** (frontend) + **Railway** (backend) in under 10 minutes:

📘 **[Full Deployment Guide](DEPLOYMENT.md)** - Step-by-step instructions

📋 **[Quick Reference](DEPLOY_QUICK_START.md)** - Fast deployment checklist

### What's Included
- ✅ PostgreSQL support (automatic on Railway)
- ✅ Environment variable configuration
- ✅ Production-ready CORS settings
- ✅ Gunicorn + Uvicorn workers
- ✅ Auto-deploy on git push
- ✅ Free tier available ($5/month after credits)

### Your App Will Be Live At:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.railway.app`

**Cost**: ~$5-10/month after free credits

---

## 📞 Support

For issues, questions, or contributions, please refer to the project repository.

**Happy Task Tracking! 🎯**
