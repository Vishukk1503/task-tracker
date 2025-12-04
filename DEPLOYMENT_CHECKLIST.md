# 📝 Pre-Deployment Checklist

Use this checklist before deploying to production.

## ✅ Code Ready

- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Backend health check works: http://localhost:8000/health
- [ ] Frontend loads correctly: http://localhost:3001
- [ ] Authentication works (login/register)
- [ ] All CRUD operations work
- [ ] Kanban board drag-and-drop works
- [ ] Analytics dashboard displays correctly
- [ ] Dark mode toggle works

## ✅ Git Repository

- [ ] Code committed to Git
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] `.gitignore` excludes `.env` files
- [ ] No sensitive data in code (API keys, passwords)
- [ ] README.md updated

## ✅ Backend Preparation

- [ ] `requirements.txt` includes all dependencies
- [ ] `Procfile` exists in backend folder
- [ ] `railway.json` exists in backend folder
- [ ] `.env.example` exists with all required variables
- [ ] Database will use PostgreSQL (not SQLite) in production
- [ ] Health check endpoint works

## ✅ Frontend Preparation

- [ ] `.env.example` exists
- [ ] `.env.local` has local API URL
- [ ] `vercel.json` configured
- [ ] No hardcoded API URLs in code
- [ ] Build works locally: `npm run build`

## ✅ Security

- [ ] Strong SECRET_KEY generated (32+ characters)
- [ ] No secrets committed to Git
- [ ] CORS configured for production domain
- [ ] JWT token expiration set appropriately
- [ ] Password hashing enabled (bcrypt)

## ✅ Environment Variables Prepared

### Backend (Railway)
- [ ] `DATABASE_URL` (will use Railway Postgres reference)
- [ ] `SECRET_KEY` (generate strong random string)
- [ ] `ALGORITHM` (HS256)
- [ ] `ACCESS_TOKEN_EXPIRE_MINUTES` (1440 for production)
- [ ] `FRONTEND_URL` (your Vercel URL)
- [ ] `ALLOWED_ORIGINS` (your Vercel URL)
- [ ] `ENVIRONMENT` (production)

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` (your Railway backend URL + /api)

## ✅ Accounts Created

- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Railway account (free trial available)

## ✅ Domain (Optional)

- [ ] Custom domain purchased (optional)
- [ ] DNS configured for Vercel
- [ ] DNS configured for Railway API

---

## 🚦 Ready to Deploy?

If all checkboxes are checked, you're ready! Follow:
1. **[DEPLOYMENT.md](DEPLOYMENT.md)** for full guide
2. **[DEPLOY_QUICK_START.md](DEPLOY_QUICK_START.md)** for quick reference

---

## 🆘 If Something Goes Wrong

### Deployment Fails
- Check Railway/Vercel logs
- Verify all environment variables are set
- Check GitHub repository is accessible
- Verify root directory is set correctly

### Backend Can't Connect to Database
- Check `DATABASE_URL` is set correctly
- Verify PostgreSQL service is running
- Check Railway database connection

### Frontend Can't Reach Backend
- Verify `NEXT_PUBLIC_API_URL` points to Railway backend
- Check CORS settings include Vercel URL
- Test backend URL directly in browser

### 404 Errors
- Check root directory settings
- Verify build succeeded
- Check deployment logs

---

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- Next.js Docs: https://nextjs.org/docs

**Good luck with your deployment! 🚀**
