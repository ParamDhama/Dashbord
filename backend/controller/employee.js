const Employee = require('../models/singup'); // Employee model
const cloudinary = require('../config/cloudinaryconnection'); // Cloudinary configuration
const { v4: uuidv4 } = require('uuid'); // UUID for unique employee IDs

// Helper function: Upload image to Cloudinary
const uploadImage = async (file) => {
  if (!file) return '';
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'employees',
  });
  return result.secure_url;
};

// Helper function: Find employee by MongoDB ObjectId or employeeId
const findEmployeeById = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return Employee.findById(id); // Search using ObjectId
  }
  return Employee.findOne({ employeeId: id }); // Search using employeeId (UUID)
};

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;

    // Upload image if provided
    const profileImage = req.file ? await uploadImage(req.file) : '';

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

    await newEmployee.save(); // Save the Employee to the database
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    res.status(400).json({ error: `Error creating employee: ${error.message}` });
  }
};

// Get Employees List (with search and pagination)
exports.getEmployees = async (req, res) => {
  try {
    const { search = '' } = req.query;

    // Search query based on input
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // Fetch all employees matching the query
    const employees = await Employee.find(query);

    res.status(200).json({
      employees,
      total: employees.length, // Total employees count
    });
  } catch (error) {
    res.status(500).json({ error: `Error fetching employees: ${error.message}` });
  }
};


// Get Employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await findEmployeeById(id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: `Error fetching employee: ${error.message}` });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Upload new image if provided
    const profileImage = req.file ? await uploadImage(req.file) : req.body.profileImage;

    const updatedEmployee = await Employee.findOneAndUpdate(
      id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { employeeId: id },
      { ...req.body, profileImage },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    res.status(400).json({ error: `Error updating employee: ${error.message}` });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await Employee.findOneAndDelete(
      id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { employeeId: id }
    );

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Error deleting employee: ${error.message}` });
  }
};
