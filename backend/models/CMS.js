const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  name: String,
  url: String
});

const CMSSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String },
    content: { type: String },
    attachments: [AttachmentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('CMS', CMSSchema);