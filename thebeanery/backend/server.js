const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

// Initialize database and create tables
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    console.log('Connecting to PostgreSQL database...');
    
    // Create users table if it doesn't exist
    console.log('Checking users table...');
    const usersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
    await client.query(usersTableQuery);
    console.log('✓ Users table ready');
    
    // Check if admin user exists, if not create it
    const adminCheck = await client.query(`SELECT * FROM users WHERE username = 'admin'`);
    if (adminCheck.rows.length === 0) {
      console.log('Creating default admin user...');
      await client.query(
        `INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, $4)`,
        ['admin', 'admin@thebeanery.com', '$2b$10$rN8KqZ8dG9fVJxKx1mO7eO7N6.ZvYxLYDqJ2H5nFc3k1nH.2vL0Hy', true]
      );
      console.log('✓ Default admin created (username: admin, password: admin123)');
    } else {
      console.log('✓ Admin user exists');
    }
    
    // Create feedback table if it doesn't exist
    console.log('Checking feedback table...');
    const feedbackTableQuery = `
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comments TEXT DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
    `;
    await client.query(feedbackTableQuery);
    
    // Get count of existing feedback
    const countResult = await client.query(`SELECT COUNT(*) as count FROM feedback`);
    const feedbackCount = countResult.rows[0].count;
    console.log(`✓ Feedback table ready with ${feedbackCount} entries`);
    
    // Get count of users
    const userCountResult = await client.query(`SELECT COUNT(*) as count FROM users`);
    const userCount = userCountResult.rows[0].count;
    console.log(`✓ Total users: ${userCount}`);
    
    client.release();
    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('Make sure DATABASE_URL environment variable is set correctly.');
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

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', database: 'PostgreSQL' });
});

// ============== AUTHENTICATION ROUTES ==============

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_admin',
      [username, email, passwordHash, false]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, isAdmin: newUser.is_admin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.is_admin
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user. Please try again.'
    });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login. Please try again.'
    });
  }
});

// Verify token (check if user is still authenticated)
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      isAdmin: req.user.isAdmin
    }
  });
});

// ============== END AUTHENTICATION ROUTES ==============

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
