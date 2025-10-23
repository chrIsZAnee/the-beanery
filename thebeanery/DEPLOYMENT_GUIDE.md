# 🚀 Deployment Guide - The Beanery

This guide will help you deploy The Beanery application using **Render** (for backend + database) and **Netlify** (for frontend).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Local Docker Deployment](#local-docker-deployment)
4. [Render Deployment (Backend + Database)](#render-deployment-backend--database)
5. [Netlify Deployment (Frontend)](#netlify-deployment-frontend)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, make sure you have:

- ✅ Git repository with your code
- ✅ [GitHub](https://github.com) account (or GitLab/Bitbucket)
- ✅ [Render](https://render.com) account (free tier available)
- ✅ [Netlify](https://netlify.com) account (free tier available)
- ✅ [Docker](https://www.docker.com/get-started) installed (for local testing)
- ✅ Node.js 18+ installed

---

## 🔐 Environment Variables

### **Backend Environment Variables (Render)**

These are the environment variables you need to configure on Render:

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `NODE_ENV` | Environment mode | `production` | ✅ Yes |
| `PORT` | Port for the backend server | `3001` | ✅ Yes |
| `DATABASE_URL` | MySQL connection string (auto-set by Render) | `mysql://user:pass@host:3306/db` | ✅ Yes |
| `CORS_ORIGIN` | Frontend URL for CORS | `https://your-app.netlify.app` | ✅ Yes |

**Note:** `DATABASE_URL` is automatically set by Render when you connect your database to the web service.

### **Frontend Environment Variables (Netlify)**

You need to create an environment variable file for your React app to connect to the backend:

1. Create a `.env.production` file in `thebeanery/` directory:

```env
VITE_API_URL=https://your-backend-app.onrender.com
```

2. Update your React app to use this variable when making API calls.

---

## 🐳 Local Docker Deployment

### Step 1: Create Environment File

Create a `.env` file in the `thebeanery/` directory:

```env
# Database Configuration
DB_ROOT_PASSWORD=rootpassword
DB_USER=beanery_user
DB_PASSWORD=beanery_password
DB_NAME=beanery
DB_PORT=3306

# Server Configuration
NODE_ENV=development
PORT=3001

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Step 2: Build and Run with Docker Compose

```bash
# Navigate to the project directory
cd thebeanery

# Start all services (database + backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

### Step 3: Access the Application

- **Backend API:** http://localhost:3001/api/health
- **Frontend:** Run `npm run dev` from `thebeanery/` directory
- **Database:** localhost:3306 (use MySQL Workbench or any MySQL client)

---

## 🌐 Render Deployment (Backend + Database)

### Step 1: Push Your Code to GitHub

```bash
# Initialize git repository (if not already done)
cd thebeanery
git init
git add .
git commit -m "Initial commit with deployment configs"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Create MySQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"MySQL"**
3. Configure the database:
   - **Name:** `beanery-db`
   - **Database:** `beanery`
   - **User:** `beanery_user`
   - **Region:** Choose closest to your users (e.g., Oregon)
   - **Plan:** Free (or paid for production)
4. Click **"Create Database"**
5. Wait for the database to be provisioned (takes 1-2 minutes)

### Step 3: Import Database Schema

After the database is created:

**Option A: Using Render Dashboard**
1. Go to your database in Render Dashboard
2. Click on **"Connect"** → **"External Connection"**
3. Copy the connection details
4. Use a MySQL client (MySQL Workbench, DBeaver, etc.) to connect
5. Execute the SQL from `backend/database/beanery.sql`

**Option B: Using MySQL CLI**
```bash
# Get the external connection string from Render dashboard
mysql -h <hostname> -u <username> -p<password> <database> < backend/database/beanery.sql
```

### Step 4: Create Web Service (Backend)

1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Select your repository and branch (`main`)
4. Render will detect the `render.yaml` file automatically
5. Click **"Apply"**

**OR manually create the service:**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name:** `beanery-backend`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./backend/Dockerfile`
   - **Docker Build Context:** `./backend`
   - **Region:** Same as your database (e.g., Oregon)
   - **Plan:** Free (or paid for production)
   - **Branch:** `main`

### Step 5: Configure Backend Environment Variables

In the Render web service settings, add these environment variables:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=[Auto-filled when you connect the database]
CORS_ORIGIN=https://your-frontend-app.netlify.app
```

**To connect the database:**
1. In your web service settings, scroll to **"Environment"**
2. Click **"Add Environment Variable"**
3. Select **"Add from database"**
4. Choose `beanery-db` → `Connection String`
5. This will auto-populate `DATABASE_URL`

### Step 6: Deploy

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for the build to complete (3-5 minutes)
3. Once deployed, note your backend URL (e.g., `https://beanery-backend.onrender.com`)

### Step 7: Test the Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 🎨 Netlify Deployment (Frontend)

### Step 1: Update API Endpoint in Frontend

Before deploying, you need to configure your React app to use the Render backend URL.

**Option A: Create environment file**

Create `.env.production` in `thebeanery/`:

```env
VITE_API_URL=https://your-backend-app.onrender.com
```

**Option B: Update code directly** (if you're making API calls directly)

Update your API calls in your React components to use the backend URL:

```typescript
// Example: Update your API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Use in your fetch calls
fetch(`${API_URL}/api/feedback`, { ... })
```

### Step 2: Deploy to Netlify

**Option A: Using Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project directory
cd thebeanery

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Follow the prompts:
# - Create & configure a new site
# - Build command: npm run build
# - Publish directory: dist
```

**Option B: Using Netlify Dashboard**

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to your Git provider (GitHub)
4. Select your repository
5. Configure build settings:
   - **Base directory:** `/` (root)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Branch:** `main`
6. Click **"Deploy site"**

### Step 3: Configure Netlify Environment Variables

1. In Netlify Dashboard, go to **Site settings** → **Environment variables**
2. Add the following variables:

```
VITE_API_URL=https://your-backend-app.onrender.com
```

3. Click **"Save"**

### Step 4: Redeploy (if needed)

If you added environment variables after the first deployment:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 5: Test the Frontend

Visit your Netlify URL (e.g., `https://your-app.netlify.app`)

The frontend should load and be able to communicate with the backend.

---

## 🔄 Post-Deployment Configuration

### Update CORS on Backend

After deploying the frontend, update the `CORS_ORIGIN` environment variable on Render:

1. Go to Render Dashboard → Your backend service
2. Go to **Environment** tab
3. Update `CORS_ORIGIN` to your Netlify URL: `https://your-app.netlify.app`
4. Save and redeploy

### Custom Domain (Optional)

**Netlify:**
1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow the instructions to configure DNS

**Render:**
1. Go to your web service → **Settings**
2. Click **"Custom domain"**
3. Add your domain and configure DNS

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Backend doesn't connect to database**

**Solution:**
- Verify `DATABASE_URL` is correctly set in Render
- Check database is in the same region as the web service
- Ensure database schema is imported
- Check Render logs: Dashboard → Your service → Logs

#### 2. **CORS errors on frontend**

**Solution:**
- Update `CORS_ORIGIN` in Render to match your Netlify URL exactly
- Redeploy the backend after updating environment variables
- Check browser console for the exact error

#### 3. **Frontend can't connect to backend**

**Solution:**
- Verify `VITE_API_URL` is set correctly in Netlify
- Check if backend is running: visit `/api/health` endpoint
- Check browser Network tab for failed requests
- Ensure backend URL doesn't have trailing slash

#### 4. **Render service won't build**

**Solution:**
- Check build logs in Render dashboard
- Verify `Dockerfile` path is correct: `./backend/Dockerfile`
- Verify Docker build context is correct: `./backend`
- Check `package.json` exists in backend folder

#### 5. **Database connection timeout**

**Solution:**
- Render free tier databases can spin down after inactivity
- First request may be slow (15-30 seconds)
- Consider upgrading to paid plan for production

#### 6. **404 on frontend routes**

**Solution:**
- Ensure `netlify.toml` is in the root directory
- Check the redirect rule is present for SPA routing
- Redeploy after adding `netlify.toml`

### Viewing Logs

**Render:**
- Dashboard → Your service → **Logs** tab
- Real-time logs show all console output

**Netlify:**
- Dashboard → **Deploys** → Click on a deploy → **Deploy log**
- For runtime errors, check browser console

---

## 📝 Quick Reference

### Render Environment Variables
```
NODE_ENV=production
PORT=3001
DATABASE_URL=[from database connection]
CORS_ORIGIN=https://your-app.netlify.app
```

### Netlify Environment Variables
```
VITE_API_URL=https://your-backend-app.onrender.com
```

### Important URLs
- **Render Dashboard:** https://dashboard.render.com/
- **Netlify Dashboard:** https://app.netlify.com/
- **Backend Health Check:** `https://your-backend.onrender.com/api/health`
- **Frontend:** `https://your-app.netlify.app`

---

## 🎉 Success!

Your application should now be live! 

- ✅ Backend API running on Render with Docker
- ✅ MySQL database on Render
- ✅ Frontend deployed on Netlify
- ✅ All services connected and working

### Next Steps

1. **Monitor your apps:** Check logs regularly in both Render and Netlify
2. **Set up custom domains:** Add your own domain names
3. **Enable HTTPS:** Both platforms provide free SSL certificates
4. **Add CI/CD:** Both platforms auto-deploy on git push
5. **Scale as needed:** Upgrade plans when you need more resources

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **Docker Docs:** https://docs.docker.com

---

**Happy Deploying! ☕🚀**

