const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');

const Class = require("../models/classModel");
const Teacher = require("../models/teacherModel");
const Student = require("../models/studentModel");
const authenticateToken = require("../Middleware/authRequest");

router.post("/create-class", authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.TeacherId;

    const { className, description, date, time, duration, maxCapacity, venue } =
      req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const existingClass = await Class.findOne({
      teacher: teacherId,
      date,
      time,
    });

    if (existingClass) {
      return res.status(400).json({
        message: "Teacher already has a class scheduled at the same time",
      });
    }

    const newClass = new Class({
      className,
      description,
      date,
      time,
      duration,
      maxCapacity,
      venue,
      teacher: teacherId,
    });

    await newClass.save();

    res
      .status(200)
      .json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/join-class/:classId", authenticateToken, async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.user.StudentId;
    console.log("Student class join : ", studentId);

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const classToJoin = await Class.findById(classId).populate("teacher");
    if (!classToJoin) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classToJoin.students.length >= classToJoin.maxCapacity) {
      return res.status(400).json({ message: "Class is already full" });
    }

    if (classToJoin.students.some(student => student.studentId.toString() === studentId)) {
      return res
        .status(400)
        .json({ message: "Student is already enrolled in the class" });
    }

    const bookingId = uuidv4();
    student.bookingId = bookingId;

    const teacher = await Class.findById(classToJoin.teacher);

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

    console.log(student.email);
    
    const mailOptions = {
      from: "zenflowyogamedia@gmail.com",
      to: student.email,
      subject: `Class booking confirmation ID - ${student.bookingId}`,
      text:
        `Dear ${student.name},\n\n` +
        `This is your booking confirmation for the yoga session on ${classToJoin.className} held by ${classToJoin.teacher.name} on ${classToJoin.date}. Your session timings is ${classToJoin.time}. Here is a short description about the class - "${classToJoin.description}".\n\n` +
        `Best regards,\nZen Flow Yoga Trainings`,
    };

    await transporter.sendMail(mailOptions);

    classToJoin.students.push({ studentId: studentId, bookingId: bookingId });
    await classToJoin.save();
    res.status(200).json({ message: "Student joined the class successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/withdraw-class/:classId", authenticateToken, async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.user.StudentId;

    const classToWithdraw = await Class.findById(classId);

    if (!classToWithdraw) {
      return res.status(404).json({ message: "Class not found" });
    }

    const isEnrolled = classToWithdraw.students.some(student => student.studentId.equals(studentId));

    if (!isEnrolled) {
      return res.status(400).json({ message: "Student is not enrolled in the class" });
    }

    classToWithdraw.students = classToWithdraw.students.filter(student => !student.studentId.equals(studentId));
    await classToWithdraw.save();

    res.status(200).json({ message: "Student withdrew from the class successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/get-classes", async (req, res) => {
  try {
    const sessions = await Class.find()
      .populate('teacher students.studentId', 'name email')
      .sort({ date: 1, time: 1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch session details." });
  }
});

router.put("/update-class/:classId", authenticateToken, async (req, res) => {
  try {
    const { classId } = req.params;
    const { className, description, date, time, duration, maxCapacity, venue } =
      req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      {
        className,
        description,
        date,
        time,
        duration,
        maxCapacity,
        venue
      },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res
      .status(200)
      .json({ message: "Class updated successfully", class: updatedClass });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/delete-class/:classId", authenticateToken, async (req, res) => {
  try {
    const { classId } = req.params;

    const deletedClass = await Class.findByIdAndDelete(classId);

    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/teacher-classes", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.TeacherId;
    const classes = await Class.find({ teacher: userId }).populate('teacher students.studentId', 'name email')
    res.status(200).json({ classes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//
router.get("/student-classes", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.StudentId;
    const classes = await Class.find({ 'students.studentId': userId }).populate('teacher students.studentId', 'name email');
    res.status(200).json({ classes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
