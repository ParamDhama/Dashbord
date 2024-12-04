const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'Token is required' });
  }

  try {
    const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = verified; // Add user data to request
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Invalid or expired token' });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    }, // Payload: User data (can include more fields as needed)
    process.env.JWT_SECRET, // Secret key
    { expiresIn: '1d' } // Token expiration time (1 day)
  );
};


// Secret key for encryption/decryption (you should store this securely)

// Encrypt a password
const encryptPassword = (value) => {
  const encrypted = CryptoJS.SHA256(value).toString();
  return encrypted;
};

module.exports = { authenticateToken, generateToken, encryptPassword };