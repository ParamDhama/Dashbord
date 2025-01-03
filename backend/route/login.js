const { v4: uuidv4 } = require('uuid'); // Import uuidv4
const { generateToken, encryptPassword } = require('../middleware/middleware'); // Import generateToken and encryptPassword
const login = require('../models/login');

exports.login = async (req, res) => {
  const { userName, passwordValue } = req.body;

  try {
    const value = encryptPassword(passwordValue);
    const user = await login.findOne({ userName, password: value });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    if (token) {
      user._doc.token = token;
    }
    return res.status(200).json({
      message: 'Login successful',
      user, // The generated token is sent to the client
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.signup = async (req, res) => {
  const { userName, passwordValue, email } = req.body; // Removed userId from body

  try {
    // Check if the user already exists
    const existingUser = await login.findOne({ $or: [{ userName }] });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Encrypt the password
    const encryptedPassword = encryptPassword(passwordValue);

    // Create the new user with a unique userId
    const newUser = new login({
      userId: uuidv4(), // Generate a unique userId
      userName,
      email,
      password: encryptedPassword,
    });

    // Save the user in the database
    await newUser.save();

    // Generate a token for the new user
    const token = generateToken(newUser);

    // Add the token to the response
    newUser._doc.token = token;

    return res.status(201).json({
      message: 'Signup successful',
      user: newUser, // Return the user details and token
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
