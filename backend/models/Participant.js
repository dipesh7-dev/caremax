const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  name: String,
  url: String,
  expiryDate: Date
});

const CarePlanSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date
});

const ParticipantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date },
    ndisNumber: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    documents: [DocumentSchema],
    carePlans: [CarePlanSchema]
  },
  { timestamps: true }
);

const Participant = mongoose.model('Participant', ParticipantSchema);
module.exports = Participant;