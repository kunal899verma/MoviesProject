# 🚀 SIMPLE DEPLOYMENT FOR INTERVIEW PROJECT

## **FORGET AWS - LET'S USE SIMPLE PLATFORMS!**

### **📋 WHAT WE'LL USE:**
- **Frontend**: Vercel (free, 1-click deploy)
- **Backend**: Railway (free, simple deploy)
- **Database**: MongoDB Atlas (free tier)

---

## **🎯 STEP 1: DEPLOY BACKEND TO RAILWAY (5 minutes)**

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Click "New Project"** → **Deploy from GitHub repo**
4. **Select your repository**: `kunal899verma/MoviesProject`
5. **Select the backend folder**
6. **Add environment variables**:
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movies
   JWT_SECRET=your-secret-key-here
   ```
7. **Deploy!** Railway will give you a URL like: `https://your-app.railway.app`

---

## **🎯 STEP 2: SETUP MONGODB ATLAS (3 minutes)**

1. **Go to**: https://www.mongodb.com/atlas
2. **Create free account**
3. **Create free cluster**
4. **Create database user**
5. **Get connection string**
6. **Update Railway environment variables** with the real MongoDB URI

---

## **🎯 STEP 3: DEPLOY FRONTEND TO VERCEL (3 minutes)**

1. **Go to**: https://vercel.com
2. **Sign up** with GitHub
3. **Import your repository**
4. **Set root directory** to `frontend`
5. **Add environment variables**:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-railway-app.railway.app
   BACKEND_URL=https://your-railway-app.railway.app
   ```
6. **Deploy!** Vercel will give you a URL like: `https://your-app.vercel.app`

---

## **🎯 STEP 4: TEST YOUR APP (2 minutes)**

1. **Open your Vercel URL**
2. **Register a new user**
3. **Login and add movies**
4. **Show to interviewer!** 🎬

---

## **✅ TOTAL TIME: ~15 MINUTES**
## **✅ TOTAL COST: $0 (all free tiers)**
## **✅ PERFECT FOR INTERVIEWS!**

**This is WAY simpler than AWS and actually works!** 🚀
