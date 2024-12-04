const { generateToken, encryptPassword } = require('../middleware/middleware');  // Import the generateToken function
const login = require('../models/login');

exports.login = async (req, res) => {
  const { userName, passwordValue } = req.body;

  try {
    const value = encryptPassword(passwordValue);
    const user = await login.findOne({ userName, password: value });
    console.log(userName, value);
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