const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  generalHealth: {
    existingMedicalConditions: String,
    medications: String,
    surgeriesOrInjuries: String,
    allergies: String
  },
  physicalHealth: {
    chronicPain: String,
    sensitiveAreas: String,
    physicalLimitations: String
  },
  yogaExperience: {
    practicedBefore: String,
    yogaStyles: String,
    goals: String,
    avoidPoses: String
  },
  suggestedSequences: [
    {
      suggestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
      },
      sequenceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sequence'
      },
      suggestedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
}, { timestamps: true });

const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
