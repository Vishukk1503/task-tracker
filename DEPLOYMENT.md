# 🚀 Deployment Guide - Task Tracker

This guide walks you through deploying your Task Tracker application to the cloud using **Vercel** (frontend) and **Railway** (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account (free) - https://vercel.com
- Railway account (free trial, then ~$5/month) - https://railway.app
- Your code pushed to a GitHub repository

---

## Part 1: Prepare Your Code

### ✅ Already Done!
Your application is already configured for deployment with:
- ✅ PostgreSQL support
- ✅ Environment variable configuration
- ✅ Production-ready CORS settings
- ✅ Deployment config files (Procfile, railway.json, vercel.json)
- ✅ .gitignore to exclude sensitive files

### 📤 Push to GitHub

1. **Initialize Git** (if not already done):
```bash
cd C:\To-Do
git init
git add .
git commit -m "Initial commit - Task Tracker ready for deployment"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name it `task-tracker` (or your preferred name)
   - DON'T initialize with README (you already have code)
   - Click "Create repository"

3. **Push your code**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/task-tracker.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend to Railway 🚂

### Step 1: Create Railway Project

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your `task-tracker` repository
6. Railway will detect your backend automatically

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will create a PostgreSQL instance
4. The database URL will be automatically generated

### Step 3: Configure Backend Service

1. Click on your backend service (Python/FastAPI)
2. Go to **"Variables"** tab
3. Add these environment variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=your-super-secret-key-minimum-32-characters-long-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000,http://localhost:3001
ENVIRONMENT=production
```

**Important Notes:**
- `DATABASE_URL` - Use the reference `${{Postgres.DATABASE_URL}}` (Railway auto-connects)
- `SECRET_KEY` - Generate a secure random string (min 32 chars)
- `FRONTEND_URL` - Will be updated after Vercel deployment
- `ALLOWED_ORIGINS` - Will be updated after Vercel deployment

4. Go to **"Settings"** tab
5. Under **"Deploy"**, set:
   - **Root Directory**: `backend`
   - **Start Command**: (auto-detected from Procfile)

6. Click **"Deploy"** 

### Step 4: Get Your Backend URL

1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. You'll get a URL like: `https://your-backend-production.up.railway.app`
4. **Copy this URL** - you'll need it for Vercel!

### Step 5: Initialize Database

1. After first deployment, go to **"Deployments"** tab
2. Wait for deployment to succeed
3. The database tables will be created automatically on first run

---

## Part 3: Deploy Frontend to Vercel ▲

### Step 1: Import Project

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import your `task-tracker` GitHub repository
4. Vercel will auto-detect Next.js

### Step 2: Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)

### Step 3: Add Environment Variables

Before deploying, add this environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-backend-production.up.railway.app/api
```

**Replace** `your-backend-production.up.railway.app` with your actual Railway backend URL from Part 2, Step 4.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for build to complete
3. You'll get a URL like: `https://your-app.vercel.app`

### Step 5: Update Backend CORS

Now that you have your Vercel URL, go back to Railway:

1. Open your Railway backend service
2. Go to **"Variables"** tab
3. Update these variables:

```env
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000,http://localhost:3001
```

4. **Redeploy** backend (click "Redeploy" button)

---

## Part 4: Create Admin User 👤

Since you're starting with a fresh database, create your first user:

### Option 1: Use Railway CLI

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and connect:
```bash
railway login
railway link
```

3. Run seed script:
```bash
railway run python seed_data.py
```

### Option 2: Register via Frontend

1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Click **"Register"**
3. Create your account:
   - Email: your@email.com
   - Username: yourusername
   - Password: securepassword

---

## Part 5: Test Your Deployment 🧪

1. **Open your Vercel URL**: `https://your-app.vercel.app`
2. **Login** with your credentials
3. **Create a task** with start date and due date
4. **Test all features**:
   - ✅ List view
   - ✅ Kanban board with drag-and-drop
   - ✅ Analytics dashboard
   - ✅ Dark mode toggle
   - ✅ Task CRUD operations

---

## 🔧 Troubleshooting

### Backend Won't Start
- **Check Railway logs**: Go to your service → "Deployments" → Click on latest deployment → "View Logs"
- **Common issues**:
  - Missing environment variables
  - Database connection failed
  - Python dependencies not installed

### Frontend Can't Connect to Backend
- **Check CORS**: Make sure `ALLOWED_ORIGINS` in Railway includes your Vercel URL
- **Check API URL**: Verify `NEXT_PUBLIC_API_URL` in Vercel points to correct Railway URL
- **Test backend directly**: Visit `https://your-backend.railway.app/health` - should return `{"status":"healthy"}`

### Database Errors
- **Check connection**: Railway dashboard → PostgreSQL → "Connect" → verify connection string
- **Migrations**: Backend auto-creates tables on first run
- **Reset database**: In Railway, delete and recreate PostgreSQL service (WARNING: deletes all data)

### CORS Errors in Browser Console
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Update `ALLOWED_ORIGINS` in Railway to include your Vercel URL, then redeploy

---

## 📊 Monitoring & Logs

### Railway (Backend)
- **Logs**: Service → "Deployments" → Select deployment → "View Logs"
- **Metrics**: Service → "Metrics" tab
- **Database**: PostgreSQL service → "Data" tab (browse tables)

### Vercel (Frontend)
- **Logs**: Project → "Deployments" → Select deployment → "View Function Logs"
- **Analytics**: Project → "Analytics" tab (requires upgrade)
- **Performance**: Project → "Speed Insights" tab

---

## 🔐 Security Checklist

Before going live, verify:

- ✅ `SECRET_KEY` in Railway is a strong, random 32+ character string
- ✅ `ALLOWED_ORIGINS` only includes your production domains (no wildcards)
- ✅ `.env` files are in `.gitignore` (never commit secrets!)
- ✅ PostgreSQL password is auto-generated by Railway (secure)
- ✅ HTTPS enabled (automatic on both Railway and Vercel)

---

## 💰 Cost Estimate

### Free Tier (Great for Portfolio/Demo):
- **Railway**: $5 free credit, then ~$5-10/month
  - PostgreSQL database included
  - Sleeps after inactivity on free tier
- **Vercel**: Free forever for personal projects
  - Unlimited deployments
  - 100GB bandwidth/month

### Total: ~$5-10/month (after free credits)

---

## 🎉 Success!

Your Task Tracker is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app`
- **API Docs**: `https://your-backend.railway.app/api/docs`

Share your live app with others! 🚀

---

## 🔄 Updating Your Deployment

Whenever you make changes:

1. **Commit and push to GitHub**:
```bash
git add .
git commit -m "Your update message"
git push
```

2. **Automatic deployment**:
   - Vercel auto-deploys on every push to `main`
   - Railway auto-deploys on every push to `main`

3. **No manual deployment needed!** ✨

---

## 📞 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎓 What You Learned

- ✅ Deploying full-stack applications to cloud
- ✅ Managing environment variables
- ✅ PostgreSQL database setup and management
- ✅ CORS configuration for production
- ✅ CI/CD with automatic deployments
- ✅ Production security best practices

**Congratulations on deploying your first production app!** 🎊
