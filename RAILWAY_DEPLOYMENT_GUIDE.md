# Railway Deployment Checklist & Troubleshooting

## ✅ Fixed Issues

### 1. **Deprecated MongoDB Options**

- ❌ `sslValidate: false` (deprecated)
- ✅ `tlsAllowInvalidCertificates: true` (new)

### 2. **Hardcoded URLs Fixed**

- ❌ `http://localhost:4201` in auth routes
- ✅ Dynamic URLs using `process.env.CLIENT_URL`

### 3. **JWT Authentication Added**

- ✅ Added `jsonwebtoken` dependency
- ✅ Created JWT utilities in `src/utils/jwt.js`
- ✅ Updated auth routes to use JWT tokens

### 4. **Production CORS Configuration**

- ✅ Multiple allowed origins including Vercel URL
- ✅ Proper CORS error handling
- ✅ Production-ready cookie settings

### 5. **Error Handling & Logging**

- ✅ Global error handler
- ✅ 404 route handler
- ✅ Health check endpoint
- ✅ Removed debug middleware

## 🚀 Railway Environment Variables

Make sure these are set in your Railway project:

```env
# Database
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/resume_builder

# Google OAuth (Production)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Application URLs
CLIENT_URL=https://resume-generator-with-ai-full-syste.vercel.app
NODE_ENV=production

# Session Secret
SESSION_SECRET=your-session-secret-key
```

## 🔍 Testing Endpoints

Once deployed, test these URLs:

1. **Health Check**: `https://your-railway-app.railway.app/health`
2. **API Root**: `https://your-railway-app.railway.app/`
3. **Auth Test**: `https://your-railway-app.railway.app/api/auth/google`

## 📋 Deployment Steps

### Step 1: Push Changes to GitHub

```bash
git add .
git commit -m "Fix Railway deployment issues - JWT auth, CORS, MongoDB config"
git push origin main
```

### Step 2: Check Railway Logs

- Go to Railway dashboard
- Click on your project
- Check the "Deployments" tab
- Look for any error messages

### Step 3: Update Google OAuth

Make sure your Google Cloud Console OAuth settings include:

- **Authorized origins**: `https://your-railway-app.railway.app`
- **Authorized redirect URIs**: `https://your-railway-app.railway.app/api/auth/google/callback`

### Step 4: Test Deployment

```bash
# Test health endpoint
curl https://your-railway-app.railway.app/health

# Test API root
curl https://your-railway-app.railway.app/
```

## 🐛 Common Issues & Solutions

### Issue: "Application failed to respond"

**Cause**: Server not starting properly
**Solution**: Check Railway logs for startup errors

### Issue: CORS errors

**Cause**: Frontend URL not in allowed origins
**Solution**: Add your Vercel URL to the `allowedOrigins` array

### Issue: MongoDB connection errors

**Cause**: Wrong connection string or network issues
**Solution**: Check MongoDB Atlas IP whitelist (use 0.0.0.0/0 for Railway)

### Issue: Google OAuth not working

**Cause**: Wrong redirect URLs or missing environment variables
**Solution**: Update Google Cloud Console settings with production URLs

## 📊 Monitoring

### Check these after deployment:

1. **Server Status**: `/health` endpoint returns 200
2. **Database**: MongoDB connection successful
3. **Authentication**: Google OAuth flow works
4. **API Routes**: Resume endpoints respond correctly
5. **CORS**: Frontend can make requests

## 🔧 Quick Fixes

If the deployment still fails:

1. **Check Railway Variables**: Make sure all environment variables are set
2. **Check MongoDB**: Test connection string locally
3. **Check Google OAuth**: Verify client ID and secret
4. **Check Logs**: Railway deployment logs for specific errors

## 📞 Support Commands

```bash
# Test MongoDB connection locally
node -e "
const mongoose = require('mongoose');
mongoose.connect('YOUR_MONGODB_URI')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));
"

# Test JWT token generation
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({test: true}, 'your-jwt-secret');
console.log('JWT works:', token);
"
```

---

**Note**: After making these changes, Railway should automatically redeploy your application. The main issues were deprecated MongoDB options, hardcoded URLs, and missing JWT authentication support.
