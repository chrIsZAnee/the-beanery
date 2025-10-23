# 🔐 Environment Variables Reference

This document lists ALL environment variables needed for deploying The Beanery application.

---

## 📱 RENDER (Backend + Database)

### 🗄️ Database Configuration

When creating MySQL database on Render, you'll set:

| Variable | Value | Description |
|----------|-------|-------------|
| Database Name | `beanery` | Name of the database |
| Database User | `beanery_user` | MySQL username |
| Region | `Oregon` | Server region (choose closest to users) |
| Plan | `Free` | Pricing plan |

Render will automatically generate:
- `DATABASE_URL` - Full MySQL connection string

---

### 🖥️ Backend Web Service Environment Variables

Add these in Render Dashboard → Your Service → Environment:

```bash
# Required Environment Variables

NODE_ENV=production
# Description: Sets Node.js environment mode
# Options: development, production

PORT=3001
# Description: Port the backend server listens on
# Default: 3001 (Render can override this)

DATABASE_URL=mysql://user:password@host:port/database
# Description: MySQL connection string (automatically set by Render)
# Format: mysql://username:password@hostname:port/database_name
# Note: This is auto-filled when you connect your database to the service

CORS_ORIGIN=https://your-frontend-app.netlify.app
# Description: Frontend URL for Cross-Origin Resource Sharing
# Format: Full URL with https:// and no trailing slash
# Example: https://beanery-app.netlify.app
# Important: Must match your Netlify deployment URL exactly
```

### How to Add Variables in Render:

1. Go to your web service in Render Dashboard
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Enter **Key** and **Value**
5. Click **"Save Changes"**

**For DATABASE_URL:**
1. Click **"Add Environment Variable"**
2. Select **"Add from Database"**
3. Choose your database: `beanery-db`
4. Select property: `Connection String`
5. Variable name: `DATABASE_URL`

---

## 🌐 NETLIFY (Frontend)

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
# Required Environment Variables

VITE_API_URL=https://your-backend-app.onrender.com
# Description: Backend API URL for making API requests
# Format: Full URL with https:// and no trailing slash
# Example: https://beanery-backend.onrender.com
# Important: Must match your Render backend URL exactly
```

### How to Add Variables in Netlify:

1. Go to **Site settings**
2. Click **"Environment variables"** in the sidebar
3. Click **"Add a variable"**
4. Select **"Add a single variable"**
5. Enter **Key**: `VITE_API_URL`
6. Enter **Value**: Your Render backend URL
7. Select scopes: **Production**, **Deploy Previews**, **Branch deploys**
8. Click **"Create variable"**

### After Adding Variables:

You MUST redeploy your site for changes to take effect:
1. Go to **Deploys** tab
2. Click **"Trigger deploy"**
3. Select **"Clear cache and deploy site"**

---

## 🐳 LOCAL DOCKER DEVELOPMENT

Create a `.env` file in the `thebeanery/` directory:

```bash
# Database Configuration
DB_ROOT_PASSWORD=rootpassword
# Description: MySQL root password (for Docker container only)

DB_USER=beanery_user
# Description: MySQL username for the application

DB_PASSWORD=beanery_password
# Description: MySQL password for the application user

DB_NAME=beanery
# Description: Database name

DB_PORT=3306
# Description: MySQL port

# Server Configuration
NODE_ENV=development
# Description: Environment mode

PORT=3001
# Description: Backend server port

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
# Description: Local frontend dev server URL
```

---

## 🔍 QUICK LOOKUP TABLE

### What to Put Where

| Environment Variable | Render | Netlify | Local .env | Description |
|---------------------|:------:|:-------:|:----------:|-------------|
| `NODE_ENV` | ✅ | ❌ | ✅ | Node environment |
| `PORT` | ✅ | ❌ | ✅ | Backend port |
| `DATABASE_URL` | ✅ | ❌ | ❌ | MySQL connection (Render only) |
| `CORS_ORIGIN` | ✅ | ❌ | ✅ | Frontend URL for CORS |
| `VITE_API_URL` | ❌ | ✅ | ✅ | Backend API URL (Frontend) |
| `DB_HOST` | ❌ | ❌ | ✅ | Local MySQL host |
| `DB_USER` | ❌ | ❌ | ✅ | Local MySQL user |
| `DB_PASSWORD` | ❌ | ❌ | ✅ | Local MySQL password |
| `DB_NAME` | ❌ | ❌ | ✅ | Local database name |

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deploying:

- [ ] Create Render account
- [ ] Create Netlify account
- [ ] Push code to GitHub
- [ ] Update `.env.production` with placeholder values

### Render Setup:

- [ ] Create MySQL database on Render
- [ ] Note the database connection string
- [ ] Import `beanery.sql` schema into database
- [ ] Create Web Service (Docker)
- [ ] Add environment variable: `NODE_ENV=production`
- [ ] Add environment variable: `PORT=3001`
- [ ] Connect database (auto-sets `DATABASE_URL`)
- [ ] Add environment variable: `CORS_ORIGIN` (Netlify URL)
- [ ] Deploy and test `/api/health` endpoint
- [ ] Note the backend URL

### Netlify Setup:

- [ ] Connect GitHub repository
- [ ] Configure build settings (build: `npm run build`, publish: `dist`)
- [ ] Add environment variable: `VITE_API_URL` (Render backend URL)
- [ ] Deploy site
- [ ] Test frontend loads correctly
- [ ] Note the frontend URL

### Post-Deployment:

- [ ] Update `CORS_ORIGIN` on Render with actual Netlify URL
- [ ] Update `VITE_API_URL` on Netlify with actual Render URL
- [ ] Redeploy both services
- [ ] Test API calls from frontend to backend
- [ ] Test database operations (submit feedback)

---

## ⚠️ IMPORTANT NOTES

### 1. URL Format

✅ **Correct:**
```
https://my-app.netlify.app
https://my-backend.onrender.com
```

❌ **Incorrect:**
```
https://my-app.netlify.app/     (trailing slash)
http://my-backend.onrender.com  (http instead of https)
my-app.netlify.app              (missing protocol)
```

### 2. First-Time Setup

You'll need to do a circular update:

1. **First Deploy Backend** → Get backend URL
2. **Deploy Frontend** with backend URL → Get frontend URL  
3. **Update Backend** `CORS_ORIGIN` with frontend URL
4. **Redeploy Backend**

### 3. Environment Variable Changes

Both platforms require redeployment after changing environment variables:

**Render:** Auto-redeploys when you save environment variables

**Netlify:** Manual - You must click "Trigger deploy" → "Clear cache and deploy"

### 4. Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Database always stays active

**Netlify Free Tier:**
- 100GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

---

## 🆘 Getting Help

If environment variables aren't working:

1. **Check spelling and capitalization** (case-sensitive!)
2. **Check for extra spaces** before/after values
3. **Verify URL format** (https://, no trailing slash)
4. **Check platform docs:**
   - Render: https://render.com/docs/environment-variables
   - Netlify: https://docs.netlify.com/environment-variables/overview/
5. **View deployment logs** for error messages

---

## 📝 Templates

### Render Environment Variables (Copy-Paste Ready)

```
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-app.netlify.app
```

### Netlify Environment Variables (Copy-Paste Ready)

```
VITE_API_URL=https://your-backend.onrender.com
```

---

**Last Updated:** October 2025

