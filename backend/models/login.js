// models/Login.js
const mongoose = require('mongoose');
const baseSchema = require('./BaseSchema');

const loginSchema = new mongoose.Schema({
  userId: { type: String, required: false, unique: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
});

loginSchema.add(baseSchema);
module.exports = mongoose.model('Login', loginSchema);