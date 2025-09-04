const mongoose = require('mongoose');

const TimesheetSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    participant: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
    date: { type: Date, required: true },
    hours: { type: Number, required: true },
    notes: { type: String },
    status: { type: String, enum: ['submitted', 'approved', 'rejected'], default: 'submitted' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timesheet', TimesheetSchema);