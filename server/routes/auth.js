const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// POST /api/auth/login - authenticate the HR admin and issue a token
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }

    const validUsername = username === process.env.ADMIN_USERNAME;
    const validPassword =
      validUsername &&
      (await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || ""));

    if (!validUsername || !validPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({ token, username });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
