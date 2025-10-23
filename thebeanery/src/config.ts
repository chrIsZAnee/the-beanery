// API Configuration
// Uses environment variable in production, falls back to localhost in development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log('🔌 API URL:', API_URL);

