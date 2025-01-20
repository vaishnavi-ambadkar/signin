// const mongoose = require('mongoose');

// const EmployeeSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     dob: Date, // Added Date of Birth field
//     password: String,
//     confirmPassword: String // Added Confirm Password field
// });

// const EmployeeModel = mongoose.model("employees", EmployeeSchema);
// module.exports = EmployeeModel;

// const mongoose = require('mongoose');

// const EmployeeSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     dob: Date, // Added Date of Birth field
//     password: String,
//     confirmPassword: String, // Added Confirm Password field
//     imageUrl: String, // Added image URL field to store the Cloudinary image URL
// });

// const EmployeeModel = mongoose.model("employees", EmployeeSchema);
// module.exports = EmployeeModel;
// Import dependencies
const express = require("express");
const EmployeeModel = require("./models/employee"); // Adjust path if necessary
const router = express.Router();

// Create an employee
router.post("/", async (req, res) => {
  try {
    const employee = new EmployeeModel(req.body); // Assumes body contains all required fields
    await employee.save();
    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Get a specific employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

// Update an employee by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json({ message: "Employee updated successfully", updatedEmployee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an employee by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

// Export the router
module.exports = router;
