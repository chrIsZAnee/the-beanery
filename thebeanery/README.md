# The Beanery - Coffee Shop Website

A modern, responsive coffee shop website built with React, TypeScript, and Vite. Features a beautiful UI with interactive elements including a menu, feedback system, and coffee pairing suggestions.

## 🚀 Features

- **Home Page**: Welcome section with best sellers and coffee pairing tool
- **Menu Page**: Complete beverage and pastry menu with order modal
- **About Page**: Information about The Beanery
- **Feedback System**: Customer feedback form with database storage
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Interactive UI**: Smooth animations and hover effects

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MySQL Server (for feedback feature)

## 🛠️ Installation

### Quick Setup (Complete Guide)

**Step 1: Setup Database**
1. Start XAMPP (Apache + MySQL)
2. Open http://localhost/phpmyadmin
3. Create database: `beanery`
4. Import file: `backend/database/beanery.sql`

📖 **Detailed instructions**: See [DATABASE_SETUP_QUICKSTART.md](DATABASE_SETUP_QUICKSTART.md)

**Step 2: Start Backend**
```bash
cd backend
npm install
npm start
```
Backend runs on: `http://localhost:3001`

**Step 3: Start Frontend**
```bash
cd thebeanery
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Frontend Only Setup (Without Database)

1. Navigate to the project directory:
```bash
cd thebeanery
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

Note: Feedback form won't work without the backend server.

### Backend Setup (for Feedback Feature)

1. **Import Database First** (See DATABASE_SETUP_QUICKSTART.md)

2. Navigate to the backend directory:
```bash
cd backend
```

3. Install backend dependencies:
```bash
npm install
```

4. Make sure MySQL is running in XAMPP

5. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The API server will start at `http://localhost:3001`

## 📁 Project Structure

```
thebeanery/
├── src/
│   ├── App.tsx           # Main app component with navigation
│   ├── App.css           # Home page styles
│   ├── Menu.tsx          # Menu page component
│   ├── Menu.css          # Menu page styles
│   ├── About.tsx         # About page component
│   ├── About.css         # About page styles
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── backend/
│   ├── server.js         # Express API server
│   ├── package.json      # Backend dependencies
│   └── README.md         # Backend documentation
├── public/
├── index.html
├── package.json
└── README.md
```

## 🎨 Technologies Used

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **CSS3** - Styling with animations

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Database
- **CORS** - Cross-origin resource sharing

## 🌟 Key Features

### Navigation System
Simple client-side routing between Home, Menu, and About pages without page reloads.

### Coffee Pairing Tool
Interactive dropdown to suggest perfect food pairings for different coffee types.

### Order System
Click any menu item to see an order confirmation modal.

### Feedback System
- Star rating (1-5)
- Comments textarea
- Backend API integration
- MySQL database storage

## 🔧 Configuration

### Database Configuration
The backend connects to MySQL with these default settings:
- Host: `localhost`
- User: `root`
- Password: `` (empty)
- Database: `beanery`

To change these, edit `backend/server.js`:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'beanery'
};
```

### CORS Configuration
The backend accepts requests from `http://localhost:5173` by default. Update in `backend/server.js` if your frontend runs on a different port.

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

## 🚀 Building for Production

1. Build the frontend:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## 🐛 Troubleshooting

### Frontend Issues
- **Port already in use**: The dev server uses port 5173 by default. Kill the process or change the port in `vite.config.ts`
- **Styles not loading**: Clear browser cache and restart dev server

### Backend Issues
- **Connection Error**: Ensure MySQL is running and credentials are correct
- **Port 3001 in use**: Change PORT in `backend/server.js`
- **CORS errors**: Verify the frontend URL matches CORS settings
- **Feedback not saving**: Check MySQL connection and table creation

## 📝 API Endpoints

### POST /api/feedback
Submit customer feedback
- Body: `{ rating: number, comments: string }`
- Returns: `{ success: boolean, message: string }`

### GET /api/feedback
Get all feedback entries (admin)

### GET /api/feedback/stats
Get feedback statistics

### GET /api/health
Health check endpoint

## 🎯 Future Enhancements

- Contact page implementation
- User authentication
- Shopping cart functionality
- Payment integration
- Admin dashboard for managing menu items
- Email notifications
- Order tracking system

## 📄 License

This project is created for educational purposes.

## 👥 Credits

- Design inspired by modern coffee shop aesthetics
- Images from Unsplash and Pexels
- Pacifico font from Google Fonts

---

**Enjoy The Beanery! ☕**
