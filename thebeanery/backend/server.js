const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration
// Make sure you have imported the database/beanery.sql file into your MySQL/MariaDB
const dbConfig = {
  host: 'localhost',  // or '127.0.0.1'
  user: 'root',       // Default XAMPP MySQL user
  password: '',       // Default XAMPP MySQL password (empty)
  database: 'beanery' // Must match the database name in beanery.sql
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and create feedback table
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    console.log('Connecting to database...');
    
    // Check if database exists
    const [databases] = await connection.query(`SHOW DATABASES LIKE 'beanery'`);
    
    if (databases.length === 0) {
      console.log('Database "beanery" not found!');
      console.log('Please import the database/beanery.sql file using phpMyAdmin or MySQL command line.');
      console.log('See database/setup_database.md for instructions.');
    } else {
      console.log('Database "beanery" found!');
    }
    
    // Use the beanery database
    await connection.query(`USE beanery`);
    
    // Check if feedback table exists
    const [tables] = await connection.query(`SHOW TABLES LIKE 'feedback'`);
    
    if (tables.length === 0) {
      console.log('Table "feedback" not found. Creating table...');
      // Create feedback table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS feedback (
          id INT(11) NOT NULL AUTO_INCREMENT,
          rating INT(11) NOT NULL,
          comments TEXT DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
      `;
      await connection.query(createTableQuery);
      console.log('Table "feedback" created successfully!');
    } else {
      // Get count of existing feedback
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM feedback`);
      const feedbackCount = countResult[0].count;
      console.log(`Table "feedback" found with ${feedbackCount} entries!`);
    }
    
    connection.release();
    console.log('Database initialized successfully ✓');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    console.error('Make sure MySQL is running in XAMPP and the database is imported.');
  }
}

// Initialize database on server start
initializeDatabase();

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
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
    
    // Insert feedback into database
    const sql = 'INSERT INTO feedback (rating, comments) VALUES (?, ?)';
    const [result] = await pool.query(sql, [parseInt(rating), comments || '']);
    
    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      feedbackId: result.insertId
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
    const [rows] = await pool.query(
      'SELECT * FROM feedback ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      feedback: rows
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
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_feedback,
        AVG(rating) as average_rating,
        MAX(rating) as highest_rating,
        MIN(rating) as lowest_rating
      FROM feedback
    `);
    
    res.json({
      success: true,
      stats: stats[0]
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
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await pool.end();
  process.exit(0);
});

