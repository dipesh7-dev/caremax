const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  day: String,
  startTime: String,
  endTime: String
});

const DocumentSchema = new mongoose.Schema({
  name: String,
  url: String,
  expiryDate: Date
});

const TrainingRecordSchema = new mongoose.Schema({
  name: String,
  completionDate: Date,
  expiryDate: Date
});

const WorkerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    availability: [AvailabilitySchema],
    complianceDocs: [DocumentSchema],
    trainingRecords: [TrainingRecordSchema],
    assignedParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }]
  },
  { timestamps: true }
);

const Worker = mongoose.model('Worker', WorkerSchema);
module.exports = Worker;