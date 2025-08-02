# Resume Builder - Deployment Guide

## ✅ Frontend Deployed Successfully!

**Vercel URL:** https://resume-generator-rho-eight.vercel.app

## 🚀 Next Step: Deploy Backend to Railway

### Backend (Railway) - Step by Step

1. **Connect to Railway:**

   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `resume-generator-with-ai-full-system` repository
   - Choose "resume-builder-backend" as the root directory

2. **Railway will auto-detect Node.js and use `npm start`**

3. **Set Environment Variables in Railway Dashboard:**
   ```
   NODE_ENV=production
   PORT=8080
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_random_secret_key_here
   GEMINI_API_KEY=AIzaSyB4LMblYJFpHsq-oH5Do0KJenXkVL0UMqI
   CLIENT_URL=https://resume-generator-rho-eight.vercel.app
   ```

### MongoDB Setup (Required First!)

1. **Create MongoDB Atlas Account:** [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create a new cluster** (free tier is fine)
3. **Create database user:**
   - Username: `resumebuilder`
   - Password: `[generate-strong-password]`
4. **Network Access:** Add `0.0.0.0/0` (allow all IPs)
5. **Get connection string:**
   ```
   mongodb+srv://resumebuilder:your_password@cluster0.xxxxx.mongodb.net/resume_builder?retryWrites=true&w=majority
   ```

### Google OAuth Setup

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create new project** or select existing
3. **Enable APIs:** Google+ API or Google People API
4. **Create OAuth 2.0 Credentials:**
   - Application type: Web application
   - Name: Resume Builder
5. **Add Authorized Origins:**
   ```
   https://resume-generator-rho-eight.vercel.app
   https://your-railway-app-url.railway.app
   ```
6. **Add Authorized Redirect URIs:**
   ```
   https://your-railway-app-url.railway.app/api/auth/google/callback
   ```

## 📋 After Railway Deployment

1. **Get your Railway URL** (e.g., `https://your-app-name.railway.app`)
2. **Update frontend:** Change `apiUrl` in `environment.prod.ts`
3. **Update Google OAuth:** Add Railway URL to authorized URIs
4. **Test the full application**

## 🔧 Quick Test Checklist

- ✅ Frontend loads at Vercel URL
- ⏳ Backend API responds at Railway URL
- ⏳ Google OAuth login works
- ⏳ Resume creation and saving works
- ⏳ PDF generation works
