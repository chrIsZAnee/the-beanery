# 🐳 Docker Deployment Guide

Complete guide for running The Beanery with Docker locally and understanding the Docker setup for Render deployment.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development with Docker](#local-development-with-docker)
3. [Docker Files Explained](#docker-files-explained)
4. [Common Docker Commands](#common-docker-commands)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Install Docker

**Windows:**
1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. Install and restart your computer
3. Ensure WSL 2 is enabled (Docker Desktop will prompt you)

**Mac:**
1. Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
2. Install and start Docker Desktop

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Verify Installation

```bash
docker --version
docker-compose --version
```

---

## 🚀 Local Development with Docker

### Step 1: Create Environment File

Create `.env` file in `thebeanery/` directory:

```bash
# Database
DB_ROOT_PASSWORD=rootpassword
DB_USER=beanery_user
DB_PASSWORD=beanery_password
DB_NAME=beanery
DB_PORT=3306

# Server
NODE_ENV=development
PORT=3001

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Step 2: Start Services

```bash
# Navigate to project directory
cd thebeanery

# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop following logs: Ctrl+C
```

### Step 3: Verify Services are Running

```bash
# Check running containers
docker-compose ps

# You should see:
# - beanery_db (MySQL)
# - beanery_backend (Node.js API)
```

### Step 4: Test the Backend

Open browser and visit:
- Health Check: http://localhost:3001/api/health
- Get Feedback: http://localhost:3001/api/feedback

### Step 5: Run Frontend

In a separate terminal:

```bash
cd thebeanery
npm install
npm run dev
```

Visit: http://localhost:5173

### Step 6: Stop Services

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v
```

---

## 📁 Docker Files Explained

### 1. `backend/Dockerfile`

```dockerfile
# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
```

**Explanation:**
- `FROM node:18-alpine`: Uses lightweight Alpine Linux with Node.js 18
- `WORKDIR /app`: Sets working directory inside container
- `COPY package*.json ./`: Copies package files first (Docker layer caching)
- `RUN npm ci --only=production`: Installs production dependencies
- `COPY . .`: Copies all application code
- `EXPOSE 3001`: Documents which port the app uses
- `HEALTHCHECK`: Allows Docker to check if app is healthy
- `CMD`: Command to run when container starts

### 2. `docker-compose.yml`

```yaml
version: '3.8'

services:
  # MySQL Database
  db:
    image: mysql:8.0
    container_name: beanery_db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-rootpassword}
      MYSQL_DATABASE: ${DB_NAME:-beanery}
      MYSQL_USER: ${DB_USER:-beanery_user}
      MYSQL_PASSWORD: ${DB_PASSWORD:-beanery_password}
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
      - ./backend/database/beanery.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - beanery_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: beanery_backend
    restart: unless-stopped
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: ${PORT:-3001}
      DB_HOST: db
      DB_USER: ${DB_USER:-beanery_user}
      DB_PASSWORD: ${DB_PASSWORD:-beanery_password}
      DB_NAME: ${DB_NAME:-beanery}
      DB_PORT: 3306
      CORS_ORIGIN: ${CORS_ORIGIN:-http://localhost:5173}
    ports:
      - "3001:3001"
    depends_on:
      db:
        condition: service_healthy
    networks:
      - beanery_network
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  db_data:

networks:
  beanery_network:
    driver: bridge
```

**Explanation:**

**Database Service:**
- `image: mysql:8.0`: Uses official MySQL 8.0 image
- `environment`: Sets MySQL credentials from .env file
- `volumes`: 
  - `db_data`: Persists database data
  - Mounts `beanery.sql` to auto-import on first run
- `healthcheck`: Ensures MySQL is ready before backend starts

**Backend Service:**
- `build`: Builds image from Dockerfile
- `depends_on`: Waits for database health check
- `environment`: Passes environment variables
- `volumes`: Enables hot-reloading for development

**Networks:**
- Creates isolated network for services to communicate

### 3. `backend/.dockerignore`

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
```

**Explanation:**
- Excludes files from Docker build context
- Reduces build time and image size
- Prevents sensitive files (.env) from being copied

---

## 🛠️ Common Docker Commands

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View running containers
docker-compose ps

# View all containers
docker ps -a
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs db

# View last 100 lines
docker-compose logs --tail=100
```

### Accessing Containers

```bash
# Open shell in backend container
docker-compose exec backend sh

# Open MySQL shell
docker-compose exec db mysql -u beanery_user -p beanery

# Run command in container
docker-compose exec backend npm --version
```

### Database Management

```bash
# Import SQL file
docker-compose exec -T db mysql -u beanery_user -p beanery < backend/database/beanery.sql

# Export database
docker-compose exec db mysqldump -u beanery_user -p beanery > backup.sql

# MySQL shell
docker-compose exec db mysql -u root -p
```

### Cleaning Up

```bash
# Remove stopped containers
docker-compose down

# Remove containers and volumes (reset everything)
docker-compose down -v

# Remove unused images
docker image prune -a

# Remove all unused resources
docker system prune -a --volumes
```

### Rebuilding

```bash
# Rebuild images
docker-compose build

# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose build backend
```

---

## 🔧 Development Workflow

### Making Code Changes

**Backend changes:**
```bash
# Changes are auto-reflected due to volume mount
# No need to rebuild for development

# If you change package.json:
docker-compose down
docker-compose build backend
docker-compose up -d
```

**Database schema changes:**
```bash
# Method 1: Reset database (loses data)
docker-compose down -v
docker-compose up -d

# Method 2: Run SQL manually
docker-compose exec db mysql -u beanery_user -p beanery -e "ALTER TABLE feedback ADD COLUMN new_column VARCHAR(255);"
```

### Debugging Issues

**Backend won't start:**
```bash
# Check logs
docker-compose logs backend

# Check if MySQL is ready
docker-compose logs db | grep "ready for connections"

# Restart backend
docker-compose restart backend
```

**Can't connect to database:**
```bash
# Verify database is running
docker-compose ps

# Check database health
docker-compose exec db mysqladmin ping -h localhost -u root -p

# Test connection
docker-compose exec backend node -e "const mysql = require('mysql2'); const con = mysql.createConnection({host:'db',user:'beanery_user',password:'beanery_password'}); con.connect(err => console.log(err || 'Connected'));"
```

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Error:** `Bind for 0.0.0.0:3001 failed: port is already allocated`

**Solution:**
```bash
# Windows - Find process using port
netstat -ano | findstr :3001

# Kill process (replace PID)
taskkill /PID <process_id> /F

# Or change port in .env file
PORT=3002
```

### Issue: Database Connection Failed

**Error:** `connect ECONNREFUSED` or `Access denied`

**Solution:**
```bash
# Check database is running
docker-compose ps

# Wait for database to be fully ready
docker-compose logs db | grep "ready for connections"

# Verify credentials in .env match docker-compose.yml
# Restart services
docker-compose down
docker-compose up -d
```

### Issue: Permission Denied

**Error:** `permission denied while trying to connect to Docker daemon`

**Solution (Linux):**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again
# Or run with sudo
sudo docker-compose up -d
```

### Issue: Out of Disk Space

**Error:** `no space left on device`

**Solution:**
```bash
# Remove unused images and volumes
docker system prune -a --volumes

# Check disk usage
docker system df
```

### Issue: Changes Not Reflected

**Problem:** Code changes don't appear in running container

**Solution:**
```bash
# For backend with volume mount, restart
docker-compose restart backend

# If still not working, rebuild
docker-compose down
docker-compose up -d --build
```

---

## 📊 Monitoring

### Container Stats

```bash
# View resource usage
docker stats

# View specific container
docker stats beanery_backend
```

### Health Checks

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' beanery_backend

# View health check logs
docker inspect --format='{{json .State.Health}}' beanery_backend | python -m json.tool
```

---

## 🚀 Production vs Development

### Development (docker-compose.yml)
- ✅ Hot-reloading enabled
- ✅ Volume mounts for live code changes
- ✅ Development dependencies included
- ✅ Debug logging enabled
- ✅ Database data persisted

### Production (Render with Dockerfile)
- ✅ Optimized image size
- ✅ Production dependencies only
- ✅ No volume mounts
- ✅ Health checks enabled
- ✅ Auto-restart on failure
- ✅ Environment-based configuration

---

## 📝 Best Practices

1. **Always use .dockerignore** to exclude unnecessary files
2. **Use multi-stage builds** for smaller production images
3. **Don't run as root** in containers (use USER directive)
4. **Use health checks** to ensure service reliability
5. **Pin specific versions** (node:18-alpine, not node:latest)
6. **Use environment variables** for configuration
7. **Keep images small** - use Alpine base images
8. **One service per container** - separate DB and API
9. **Use volumes** for persistent data
10. **Regular cleanup** - remove unused images/containers

---

## 🆘 Getting More Help

- **Docker Docs:** https://docs.docker.com
- **Docker Compose Docs:** https://docs.docker.com/compose
- **Render Docker Docs:** https://render.com/docs/docker
- **MySQL Docker Image:** https://hub.docker.com/_/mysql

---

**Happy Dockerizing! 🐳☕**

