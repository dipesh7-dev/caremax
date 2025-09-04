const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  name: String,
  url: String
});

const IncidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    participant: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    type: { type: String },
    description: { type: String },
    attachments: [AttachmentSchema],
    status: { type: String, enum: ['pending', 'review', 'closed'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incident', IncidentSchema);