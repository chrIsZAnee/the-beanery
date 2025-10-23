const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration
// PostgreSQL connection using DATABASE_URL (Render) or individual env vars (local)
function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    // Render provides DATABASE_URL for PostgreSQL
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }
  
  // Fallback to individual environment variables for local development
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'beanery',
    port: process.env.DB_PORT || 5432,
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
  };
}

const dbConfig = getDatabaseConfig();

// Create database connection pool
const pool = new Pool(dbConfig);

// Initialize database and create feedback table
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    console.log('Connecting to PostgreSQL database...');
    
    // Check if feedback table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Table "feedback" not found. Creating table...');
      // Create feedback table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS feedback (
          id SERIAL PRIMARY KEY,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comments TEXT DEFAULT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
      `;
      await client.query(createTableQuery);
      console.log('Table "feedback" created successfully!');
    } else {
      // Get count of existing feedback
      const countResult = await client.query(`SELECT COUNT(*) as count FROM feedback`);
      const feedbackCount = countResult.rows[0].count;
      console.log(`Table "feedback" found with ${feedbackCount} entries!`);
    }
    
    client.release();
    console.log('Database initialized successfully ✓');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.error('Make sure PostgreSQL is running and the database is created.');
    console.error('For Render: Import database/beanery-postgres.sql via dashboard or psql');
  }
}

// Initialize database on server start
initializeDatabase();

// Test database connection
pool.on('connect', () => {
  console.log('💾 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', database: 'PostgreSQL' });
});

// Submit feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { rating, comments } = req.body;
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rating. Rating must be between 1 and 5.'
      });
    }
    
    // Insert feedback into database (PostgreSQL uses $1, $2 instead of ?)
    const sql = 'INSERT INTO feedback (rating, comments) VALUES ($1, $2) RETURNING id';
    const result = await pool.query(sql, [parseInt(rating), comments || null]);
    
    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      feedbackId: result.rows[0].id
    });
    
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback. Please try again.'
    });
  }
});

// Get all feedback (optional - for admin purposes)
app.get('/api/feedback', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM feedback ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      feedback: result.rows
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback'
    });
  }
});

// Get feedback statistics (optional)
app.get('/api/feedback/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_feedback,
        AVG(rating) as average_rating,
        MAX(rating) as highest_rating,
        MIN(rating) as lowest_rating
      FROM feedback
    `);
    
    res.json({
      success: true,
      stats: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS enabled for: ${corsOptions.origin}`);
  console.log(`💾 Database: PostgreSQL`);
  if (process.env.DATABASE_URL) {
    console.log(`🔌 Using DATABASE_URL connection`);
  } else {
    console.log(`🔌 Database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
  }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down server...');
  await pool.end();
  process.exit(0);
});
