# 🚀 QUICK START GUIDE

Follow these steps to get the Task Tracker application running in minutes!

## Prerequisites
- Python 3.8+ installed
- Node.js 18+ installed
- Terminal/PowerShell access

---

## 🎯 Step-by-Step Setup

### STEP 1: Start the Backend (FastAPI)

Open PowerShell and run:

```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env

# Seed database with demo data
python seed_data.py

# Start the server
python -m uvicorn app.main:app --reload
```

✅ Backend running at: **http://localhost:8000**  
📚 API Docs at: **http://localhost:8000/api/docs**

---

### STEP 2: Start the Frontend (Next.js)

Open a NEW PowerShell window and run:

```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

---

## 🎮 Using the Application

### Option 1: Use Demo Account
1. Go to http://localhost:3000
2. Click "Sign in"
3. Use credentials:
   - **Username:** `demo`
   - **Password:** `demo123`

### Option 2: Create New Account
1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill in your details
4. Start creating tasks!

---

## ✨ Features to Try

1. **Create a Task**
   - Click "New Task" button
   - Fill in title, description, priority, status, and due date
   - Click "Create Task"

2. **Search Tasks**
   - Use the search bar to find tasks by title or description

3. **Filter Tasks**
   - Filter by status (Not Started, In Progress, Completed)
   - Filter by priority (Low, Medium, High)
   - Sort by date, priority, or status

4. **Edit a Task**
   - Click the edit icon on any task card
   - Modify details
   - Click "Update Task"

5. **Delete a Task**
   - Click the trash icon on any task card
   - Confirm deletion

6. **Track Progress**
   - View color-coded priorities
   - See due date warnings for overdue tasks
   - Track task status with visual indicators

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```powershell
python -m uvicorn app.main:app --reload --port 8001
```
Update frontend `.env.local` to: `NEXT_PUBLIC_API_URL=http://localhost:8001/api`

**Virtual environment activation issues:**
```powershell
# Try
.\venv\Scripts\Activate.ps1

# If policy error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Database errors:**
```powershell
# Delete and recreate database
rm tasks.db
python seed_data.py
```

### Frontend Issues

**Port 3000 already in use:**
```powershell
# Kill process or use different port
npm run dev -- -p 3001
```

**Module not found:**
```powershell
rm -rf node_modules
rm package-lock.json
npm install
```

**API connection failed:**
- Ensure backend is running on port 8000
- Check `.env.local` has correct API URL
- Verify no firewall blocking connections

---

## 📖 Next Steps

1. **Explore the API**
   - Visit http://localhost:8000/api/docs
   - Try API endpoints directly

2. **Read Full Documentation**
   - See README.md for complete features
   - Check backend/README.md for API details
   - Check frontend/README.md for UI details

3. **Customize**
   - Modify color schemes in globals.css
   - Add new task fields
   - Extend functionality

---

## 🎯 Key URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:8000 | API server |
| API Docs | http://localhost:8000/api/docs | Interactive API documentation |
| API ReDoc | http://localhost:8000/api/redoc | Alternative API docs |

---

## 🌟 Demo Credentials

**Username:** demo  
**Password:** demo123

This account has 10 pre-populated tasks to explore the features!

---

## ✅ Success Checklist

- [ ] Backend server running without errors
- [ ] Frontend server running without errors
- [ ] Can login with demo credentials
- [ ] Can see list of tasks
- [ ] Can create a new task
- [ ] Can edit a task
- [ ] Can delete a task
- [ ] Can search and filter tasks
- [ ] Toast notifications appear
- [ ] All pages load correctly

---

**You're all set! Happy task tracking! 🎉**
