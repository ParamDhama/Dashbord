const mongoose = require('mongoose');

// Define the base schema for timestamps
const baseSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    createdBy: { type: String, required: false },
    modifiedBy: { type: String, required: false }
});

module.exports = baseSchema;