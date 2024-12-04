const express = require('express');
const router = express.Router();

// Import signup and login route files
const signupControllerRoutes = require('./sigup'); // Ensure file paths are correct
const loginRoutes = require('./login'); // Ensure file paths are correct
const { authenticateToken } = require('../middleware/middleware');

// Define the /signup route
router.use('/signup', authenticateToken, signupControllerRoutes);

// Define the /login route
router.use('/login', loginRoutes.login);

module.exports = router;