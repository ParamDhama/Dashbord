const Employee = require('../models/singup'); // Import the Employee model
const cloudinary = require('../config/cloudinaryconnection'); // Cloudinary configuration
const { v4: uuidv4 } = require('uuid'); // UUID for unique employee IDs

// Create Employee with optional image upload
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;

    // Handle image upload if provided
    let profileImage = ''; // Default to empty string
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'employees', // Save under the 'employees' folder in Cloudinary
      });
      profileImage = result.secure_url; // Get the secure URL of the uploaded image
    }

    // Create a new Employee document
    const newEmployee = new Employee({
      employeeId: uuidv4(),
      profileImage,
      name,
      email,
      mobile,
      designation,
      gender,
      course,
    });

    // Save the Employee to the database
    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Employee List with Search and Filters
exports.getEmployees = async (req, res) => {
  try {
    const { search } = req.query;

    // Create query object based on search input
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } }, // Case-insensitive name match
            { email: { $regex: search, $options: 'i' } }, // Case-insensitive email match
          ],
        }
      : {};

    // Find matching employees
    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Employee with optional image upload
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Handle optional image upload
    let profileImage = req.body.profileImage; // Keep existing profileImage if no new upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'employees', // Save under the 'employees' folder in Cloudinary
      });
      profileImage = result.secure_url; // Update with the new secure URL
    }

    // Update Employee document
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { ...req.body, profileImage }, // Use profileImage field explicitly
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the Employee document
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
