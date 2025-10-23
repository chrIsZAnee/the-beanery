# The Beanery Backend API

This is the backend API server for The Beanery coffee shop application. It handles feedback submission and storage using MySQL database.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
   - Copy `.env.example` to `.env`
   - Update the database credentials if needed

4. Make sure MySQL server is running on your system

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Submit Feedback
- **POST** `/api/feedback`
- Body: `{ rating: number, comments: string }`
- Submits user feedback to the database

### Get All Feedback (Admin)
- **GET** `/api/feedback`
- Returns all feedback entries

### Get Feedback Statistics
- **GET** `/api/feedback/stats`
- Returns statistics about feedback ratings

## Database Schema

The `feedback` table structure:
```sql
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rating INT NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## CORS Configuration

The server is configured to accept requests from the React development server (http://localhost:5173). Update the CORS settings in `server.js` if your frontend runs on a different port.

## Troubleshooting

- **Connection Error**: Ensure MySQL is running and credentials are correct
- **Port Already in Use**: Change the PORT in server.js or kill the process using port 3001
- **CORS Issues**: Make sure the frontend URL matches the CORS configuration

