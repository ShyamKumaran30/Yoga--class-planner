const mongoose = require("mongoose");

const asanaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  benefits: {
    type: [String],
    required: true,
  },
  image: {
    type: [String],
    required: true
  },
  asanaType: {
    type: String,
    enum: [
      "Full-body",
      "Legs",
      "Back",
      "Abdominals",
      "Arms",
      "Hamstrings",
      "Hips",
      "Chest",
      "Shoulders",
    ],
  },
  addedByName: {
    type: String,
    required: true,
  },
  addedById: {
    type: String,
    required: true,
  },
});

const Asana = mongoose.model("Asana", asanaSchema);

module.exports = Asana;