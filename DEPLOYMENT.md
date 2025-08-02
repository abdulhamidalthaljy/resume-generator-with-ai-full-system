# Resume Builder - Deployment Guide

## 🚀 Deployment Steps

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set build command: `npm run build:prod`
4. Set output directory: `dist/resume-builder-angular`
5. Update `environment.prod.ts` with your Railway backend URL

### Backend (Railway)

1. Connect your GitHub repo to Railway
2. Railway will auto-detect Node.js and use `npm start`
3. Set the following environment variables in Railway:

#### Required Environment Variables for Railway:

```
NODE_ENV=production
PORT=8080
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_random_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=https://your-vercel-app-url.vercel.app
API_URL=https://your-railway-app.railway.app
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select your project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:5050/api/auth/google/callback`
   - Production: `https://your-railway-app.railway.app/api/auth/google/callback`
6. Add authorized origins:
   - Development: `http://localhost:4201`
   - Production: `https://your-vercel-app-url.vercel.app`

### MongoDB Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist Railway's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string

## 📝 Final Steps

1. Update URLs in `environment.prod.ts` after getting your Railway URL
2. Update Google OAuth redirect URIs with your production URLs
3. Test the deployment

## 🔧 Troubleshooting

- Check Railway logs for backend issues
- Check Vercel function logs for frontend issues
- Verify all environment variables are set correctly
- Ensure CORS origins match your frontend URL
