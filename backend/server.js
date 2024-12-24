// server.js
const express = require('express');
const connectDB = require('./config/dataconection'); // MongoDB connection configuration
const cloudinary = require('cloudinary').v2; // Cloudinary configuration (Ensure you use .v2)
require('dotenv').config(); // Load environment variables
const indexRoutes = require('./route/index.route'); // Main router for the app
const cors = require('cors'); // CORS middleware

// Initialize Express App
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for Cross-Origin Resource Sharing
app.use(cors());

// Connect to MongoDB
connectDB(); // Ensure your `dataconection.js` exports a `connectDB` function
// Main API Routes
app.use('/api', indexRoutes);

// Default Route for Testing
// app.get('/', (req, res) => {
//   res.send('Hi, Server is running!');
// });

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT);
