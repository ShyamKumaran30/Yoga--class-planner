const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    venue: {
      type: String,
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    // students: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Student',
    // }]
    students: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        bookingId: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
