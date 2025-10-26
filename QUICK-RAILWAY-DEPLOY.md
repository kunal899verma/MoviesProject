# 🚀 QUICK RAILWAY DEPLOYMENT - 10 MINUTES TO LIVE APP

## **STEP 1: PREPARE YOUR CODE (2 minutes)**

Update your backend `package.json` to include a start script:

```json
{
  "scripts": {
    "start": "node dist/main.js",
    "build": "nest build"
  }
}
```

## **STEP 2: DEPLOY BACKEND TO RAILWAY**

1. **Visit**: https://railway.app
2. **Login with GitHub**
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: `kunal899verma/MoviesProject`
5. **Root Directory**: `/backend`
6. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/movies
   JWT_SECRET=interview-secret-key-2024
   ```

## **STEP 3: DEPLOY FRONTEND TO VERCEL**

1. **Visit**: https://vercel.com
2. **Import Git Repository**
3. **Select**: `kunal899verma/MoviesProject`
4. **Root Directory**: `/frontend`
5. **Environment Variables**:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.railway.app
   BACKEND_URL=https://your-railway-url.railway.app
   ```

## **STEP 4: GET MONGODB (OPTIONAL)**

For a real database, use MongoDB Atlas:
1. **Visit**: https://www.mongodb.com/atlas
2. **Create free cluster**
3. **Get connection string**
4. **Update Railway MONGODB_URI**

## **🎯 RESULT:**
- **Backend**: `https://your-app.railway.app`
- **Frontend**: `https://your-app.vercel.app`
- **Ready for interview!** 🎬

**This is 100x simpler than AWS!** 🚀
