const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  experience: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
  },
  passwordResetToken: {
    type: String
  },
  passwordResetTokenExpiry: {
    type: String
  }
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
