const express = require("express");
const Employee = require("../models/Employee");

const router = express.Router();

const REQUIRED_FIELDS = [
  "empId",
  "empName",
  "designation",
  "salary",
  "experience",
  "address",
  "mobile",
  "joinDate",
];

// GET /api/employees - list all employees, most recently added first
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// POST /api/employees - add a new employee
router.post("/", async (req, res) => {
  try {
    const missing = REQUIRED_FIELDS.filter(
      (field) => req.body[field] === undefined || req.body[field] === ""
    );
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
    }

    const { empId, empName, designation, salary, experience, address, mobile, joinDate } =
      req.body;

    const numericSalary = Number(salary);
    const numericExperience = Number(experience);
    if (Number.isNaN(numericSalary) || numericSalary < 0) {
      return res.status(400).json({ error: "salary must be a non-negative number" });
    }
    if (Number.isNaN(numericExperience) || numericExperience < 0) {
      return res.status(400).json({ error: "experience must be a non-negative number" });
    }

    const employee = await Employee.create({
      empId,
      empName,
      designation,
      salary: numericSalary,
      experience: numericExperience,
      address,
      mobile,
      joinDate: new Date(joinDate),
    });

    res.status(201).json(employee);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "An employee with this Emp Id already exists" });
    }
    res.status(500).json({ error: "Failed to save employee" });
  }
});

// DELETE /api/employees/:id - remove an employee
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

module.exports = router;
