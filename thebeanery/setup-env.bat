@echo off
REM Environment Setup Script for The Beanery (Windows)
REM This script helps you create .env files for local development

echo.
echo 🚀 The Beanery - Environment Setup
echo ==================================
echo.

REM Create root .env for docker-compose
echo 📝 Creating .env file for Docker Compose...
(
echo # Database Configuration
echo DB_ROOT_PASSWORD=rootpassword
echo DB_USER=beanery_user
echo DB_PASSWORD=beanery_password
echo DB_NAME=beanery
echo DB_PORT=3306
echo.
echo # Server Configuration
echo NODE_ENV=development
echo PORT=3001
echo.
echo # CORS Configuration
echo CORS_ORIGIN=http://localhost:5173
) > .env

echo ✅ Created: .env

REM Create backend .env
echo 📝 Creating backend\.env file...
(
echo # Database Configuration
echo DB_HOST=localhost
echo DB_USER=root
echo DB_PASSWORD=
echo DB_NAME=beanery
echo DB_PORT=3306
echo.
echo # Server Configuration
echo NODE_ENV=development
echo PORT=3001
echo.
echo # CORS Configuration ^(Frontend URL^)
echo CORS_ORIGIN=http://localhost:5173
) > backend\.env

echo ✅ Created: backend\.env

REM Create .env.development for frontend
echo 📝 Creating .env.development for frontend...
(
echo # Development Environment Variables for Frontend
echo VITE_API_URL=http://localhost:3001
) > .env.development

echo ✅ Created: .env.development

REM Create .env.production template for frontend
echo 📝 Creating .env.production template for frontend...
(
echo # Production Environment Variables for Frontend
echo # Update this with your actual Render backend URL after deployment
echo.
echo VITE_API_URL=https://your-backend-app.onrender.com
) > .env.production

echo ✅ Created: .env.production ^(template - update after deployment^)

echo.
echo 🎉 Environment files created successfully!
echo.
echo 📋 Next Steps:
echo.
echo For Docker Development:
echo   1. Run: docker-compose up -d
echo   2. Run: npm run dev
echo   3. Visit: http://localhost:5173
echo.
echo For XAMPP Development:
echo   1. Start XAMPP MySQL
echo   2. Import backend\database\beanery.sql
echo   3. Run: cd backend ^&^& npm start
echo   4. Run: npm run dev ^(in new terminal^)
echo   5. Visit: http://localhost:5173
echo.
echo For Production Deployment:
echo   1. Deploy to Render ^(backend^)
echo   2. Update .env.production with Render backend URL
echo   3. Deploy to Netlify ^(frontend^)
echo   4. See DEPLOYMENT_SUMMARY.md for details
echo.
echo Happy coding! ☕🚀
echo.
pause

