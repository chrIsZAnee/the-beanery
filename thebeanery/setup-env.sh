#!/bin/bash

# Environment Setup Script for The Beanery
# This script helps you create .env files for local development

echo "🚀 The Beanery - Environment Setup"
echo "=================================="
echo ""

# Create root .env for docker-compose
echo "📝 Creating .env file for Docker Compose..."
cat > .env << 'EOL'
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
EOL

echo "✅ Created: .env"

# Create backend .env
echo "📝 Creating backend/.env file..."
cat > backend/.env << 'EOL'
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=beanery
DB_PORT=3306

# Server Configuration
NODE_ENV=development
PORT=3001

# CORS Configuration (Frontend URL)
CORS_ORIGIN=http://localhost:5173
EOL

echo "✅ Created: backend/.env"

# Create .env.development for frontend
echo "📝 Creating .env.development for frontend..."
cat > .env.development << 'EOL'
# Development Environment Variables for Frontend
VITE_API_URL=http://localhost:3001
EOL

echo "✅ Created: .env.development"

# Create .env.production template for frontend
echo "📝 Creating .env.production template for frontend..."
cat > .env.production << 'EOL'
# Production Environment Variables for Frontend
# Update this with your actual Render backend URL after deployment

VITE_API_URL=https://your-backend-app.onrender.com
EOL

echo "✅ Created: .env.production (template - update after deployment)"

echo ""
echo "🎉 Environment files created successfully!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "For Docker Development:"
echo "  1. Run: docker-compose up -d"
echo "  2. Run: npm run dev"
echo "  3. Visit: http://localhost:5173"
echo ""
echo "For XAMPP Development:"
echo "  1. Start XAMPP MySQL"
echo "  2. Import backend/database/beanery.sql"
echo "  3. Run: cd backend && npm start"
echo "  4. Run: npm run dev (in new terminal)"
echo "  5. Visit: http://localhost:5173"
echo ""
echo "For Production Deployment:"
echo "  1. Deploy to Render (backend)"
echo "  2. Update .env.production with Render backend URL"
echo "  3. Deploy to Netlify (frontend)"
echo "  4. See DEPLOYMENT_SUMMARY.md for details"
echo ""
echo "Happy coding! ☕🚀"

