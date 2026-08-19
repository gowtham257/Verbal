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

// GET /api/employees - list all active employees, most recently added first
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// GET /api/employees/trash - list deleted employees, most recently deleted first
router.get("/trash", async (req, res) => {
  try {
    const employees = await Employee.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deleted employees" });
  }
});

// GET /api/employees/:id - get a single employee
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employee" });
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

// PUT /api/employees/:id - update an existing employee
router.put("/:id", async (req, res) => {
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

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        empId,
        empName,
        designation,
        salary: numericSalary,
        experience: numericExperience,
        address,
        mobile,
        joinDate: new Date(joinDate),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "An employee with this Emp Id already exists" });
    }
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// DELETE /api/employees/:id - soft delete an employee (recoverable via /restore)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Employee.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true }
    );
    if (!deleted) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

// POST /api/employees/:id/restore - recover a soft-deleted employee
router.post("/:id/restore", async (req, res) => {
  try {
    const restored = await Employee.findOneAndUpdate(
      { _id: req.params.id, deletedAt: { $ne: null } },
      { deletedAt: null },
      { new: true }
    );
    if (!restored) {
      return res.status(404).json({ error: "Deleted employee not found" });
    }
    res.json(restored);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "An active employee with this Emp Id already exists" });
    }
    res.status(500).json({ error: "Failed to restore employee" });
  }
});

module.exports = router;
