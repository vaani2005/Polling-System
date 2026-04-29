const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ msg: "Invalid email" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ msg: "Password must be 6+ chars" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed });

  res.json({ msg: "Registered successfully" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

module.exports = router;
