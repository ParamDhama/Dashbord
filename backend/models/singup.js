const mongoose = require('mongoose');
const baseSchema = require('./BaseSchema');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  profileImage: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true }, // Corrected the typo here
  mobile: { type: Number, required: true },
  designation: { type: String, required: true, enum: ['Hr', 'Manager', 'Sales'] },
  gender: { type: String, required: true },
  course: [String],
});

// Add the base schema fields
employeeSchema.add(baseSchema);

module.exports = mongoose.model('Employee', employeeSchema);
