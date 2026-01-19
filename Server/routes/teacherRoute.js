const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Teacher = require("../models/teacherModel");
const authenticateToken = require("../Middleware/authRequest");

const crypto = require("crypto");

function generateResetToken() {
  return crypto.randomBytes(20).toString("hex");
}

router.post("/register", async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const existingTeacher = await Teacher.findOne({ email: req.body.email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newTeacher = new Teacher({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      birthDate: req.body.birthDate,
      experience: req.body.experience,
    });

    await newTeacher.save();

    res.status(200).json({ message: "Teacher registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const existingTeacher = await Teacher.findOne({ email: req.body.email });
    if (!existingTeacher) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      existingTeacher.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ TeacherId: existingTeacher._id }, process.env.SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.TeacherId;
    const user = await Teacher.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/update", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.TeacherId;

    const user = await Teacher.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      req.body.name ||
      req.body.email ||
      req.body.password ||
      req.body.birthDate
    ) {
      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
      }
      if (req.body.birthDate) {
        user.birthDate = req.body.birthDate;
      }

      await user.save();

      res.status(200).json({ message: "User details updated successfully" });
    } else {
      res.status(400).json({ message: "No fields provided for updating" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/delete-profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.TeacherId;

    const user = await Teacher.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Teacher.findByIdAndDelete(userId);

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/teacher-list", async (req, res) => {
  try {
    const teachers = await Teacher.find();

    const teacherDetails = teachers.map(teacher => ({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email
    }));

    res.json(teacherDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/request-password-reset", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const token = generateResetToken();
    const expiry = Date.now() + 3600000;

    teacher.passwordResetToken = token;
    teacher.passwordResetTokenExpiry = expiry;
    await teacher.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp@gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "zenflowyogamedia@gmail.com",
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "zenflowyogamedia@gmail.com",
      to: teacher.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: http://localhost:3000/teacher/reset-password/${token}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const teacher = await Teacher.findOne({
      passwordResetToken: token,
      passwordResetTokenExpiry: { $gt: Date.now() }
    });

    if (!teacher) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    teacher.password = hashedPassword;
    teacher.passwordResetToken = undefined;
    teacher.passwordResetTokenExpiry = undefined;
    await teacher.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
