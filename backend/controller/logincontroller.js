
// Login validation
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Login = require('../models/login');

// Login validation
const login = async (req, res) => {
  debugger;
  const { userName, password } = req.body;
  const user = await Login.findOne({ userName });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate a JWT token
    const token = jwt.sign({ id: user._id, userName: user.userName }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });
    res.status(200).send({ message: 'Login successful', token, user });
  } else {
    res.status(401).send({ message: 'Invalid login details' });
  }
};

module.exports = { login };
