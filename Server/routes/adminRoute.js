const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const Asana = require("../models/asanaModel");
const Class = require("../models/classModel");

router.post("/login", async (req, res) => {
  try {
    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { Admin: process.env.ADMIN_ID },
      process.env.SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/student/register", async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const existingStudent = await Student.findOne({ email: req.body.email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const newStudent = new Student({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      birthDate: req.body.birthDate,
    });

    await newStudent.save();

    res.status(200).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/all-students", async (req, res) => {
  try {
    const allStudents = await Student.find();
    res.status(200).json(allStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/student/update", async (req, res) => {
  try {
    const userId = req.body.StudentId;

    const user = await Student.findById(userId);
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

router.delete("/student/delete-profile", async (req, res) => {
  try {
    const userId = req.body.StudentId;

    const user = await Student.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Student.findByIdAndDelete(userId);

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Teacher
router.post("/teacher/register", async (req, res) => {
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
    });

    await newTeacher.save();

    res.status(200).json({ message: "Teacher registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/all-teachers", async (req, res) => {
  try {
    const allTeachers = await Teacher.find();
    res.status(200).json(allTeachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/teacher/update", async (req, res) => {
  try {
    const userId = req.body.TeacherId;

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

router.delete("/teacher/delete-profile", async (req, res) => {
  try {
    const userId = req.body.TeacherId;

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

//Asana
router.get("/view-asanas", async (req, res) => {
    try {
      const asanas = await Asana.find();
  
      res.status(200).json({ asanas });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

//Class
router.get("/get-classes", async (req, res) => {
    try {
      const sessions = await Class.find()
        .populate("teacher")
        .populate("students")
        .sort({ date: 1, time: 1 });
      res.status(200).json(sessions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch session details." });
    }
  });

module.exports = router;
