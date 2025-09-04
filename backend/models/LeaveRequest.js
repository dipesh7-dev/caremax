const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    type: { type: String, enum: ['sick', 'personal', 'annual'], required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    reason: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);