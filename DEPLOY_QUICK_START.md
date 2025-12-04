# 🚀 Quick Deployment Reference

## Before You Start
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Vercel account created

---

## Railway Backend Setup (5 minutes)

1. **New Project** → Deploy from GitHub → Select repo
2. **Add Database** → New → PostgreSQL
3. **Set Variables**:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   SECRET_KEY=random-32-char-string
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ENVIRONMENT=production
   FRONTEND_URL=https://your-app.vercel.app (update after Vercel)
   ALLOWED_ORIGINS=https://your-app.vercel.app (update after Vercel)
   ```
4. **Settings** → Root Directory: `backend`
5. **Generate Domain** → Copy URL

---

## Vercel Frontend Setup (3 minutes)

1. **New Project** → Import from GitHub
2. **Configure**:
   - Root Directory: `frontend`
   - Framework: Next.js (auto-detected)
3. **Add Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR_RAILWAY_URL/api
   ```
4. **Deploy** → Copy your Vercel URL

---

## Final Step: Update Railway

Go back to Railway → Variables → Update:
```
FRONTEND_URL=https://YOUR_VERCEL_URL
ALLOWED_ORIGINS=https://YOUR_VERCEL_URL
```
Redeploy backend.

---

## ✅ Done!
Visit your Vercel URL and register your first user!

**Full Guide**: See `DEPLOYMENT.md` for detailed instructions.
