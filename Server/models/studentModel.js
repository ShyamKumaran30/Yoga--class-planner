const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
  passwordResetToken: {
    type: String
  },
  passwordResetTokenExpiry: {
    type: String
  }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
