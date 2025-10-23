-- PostgreSQL Database Schema for The Beanery
-- This replaces the MySQL schema for deployment on Render

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS feedback CASCADE;

-- Create feedback table
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster queries
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);

-- Insert sample data
INSERT INTO feedback (id, rating, comments) VALUES
(2, 4, 'Tastes good!'),
(3, 2, 'I couldn''t taste the lemon on the lemon cake but the affogato was buzzin'''),
(4, 1, 'I wish they would add frappe more'),
(5, 5, 'The pound cake was really good. I''ll come again.'),
(6, 3, 'Flat white was 50/50 but glad, my partner likes it');

-- Update the sequence to start from 7 (after existing data)
SELECT setval('feedback_id_seq', (SELECT MAX(id) FROM feedback));

-- Grant permissions (if needed for specific user)
-- GRANT ALL PRIVILEGES ON TABLE feedback TO the_beanery_user;
-- GRANT USAGE, SELECT ON SEQUENCE feedback_id_seq TO the_beanery_user;

