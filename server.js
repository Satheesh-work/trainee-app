// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const { testConnection } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));


// Mount user routes at /api/users (prefix)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler - Custom middleware
app.use(errorHandler); 

// Start server and test database connection
const startServer = async () => {
  try {
    // Test database connection first
    await testConnection();
    
    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
