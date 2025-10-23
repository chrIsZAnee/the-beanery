-- Create Users Table for Authentication
-- Run this in your Render PostgreSQL database

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert default admin user
-- Username: admin
-- Password: admin123
INSERT INTO users (username, email, password_hash, is_admin) VALUES
('admin', 'admin@thebeanery.com', '$2b$10$rN8KqZ8dG9fVJxKx1mO7eO7N6.ZvYxLYDqJ2H5nFc3k1nH.2vL0Hy', true)
ON CONFLICT (username) DO NOTHING;

-- Verify the table was created
SELECT 'Users table created successfully!' as status;
SELECT COUNT(*) as user_count FROM users;

