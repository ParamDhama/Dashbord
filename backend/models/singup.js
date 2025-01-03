const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const baseSchema = require('./baseSchema');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
  },
  profileImage: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true }, 
  mobile: { type: Number, required: true },
  designation: { type: String, required: true, enum: ['Hr', 'Manager', 'Sales'] },
  gender: { type: String, required: true },
  course: [String],
});

// Add the base schema fields
employeeSchema.add(baseSchema);

module.exports = mongoose.model('Employee', employeeSchema);
