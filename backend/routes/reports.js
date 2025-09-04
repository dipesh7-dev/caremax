const express = require('express');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const Participant = require('../models/Participant');
const Timesheet = require('../models/Timesheet');
const ProgressNote = require('../models/ProgressNote');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * Helper to build a report for a participant.  This function gathers
 * progress notes and timesheet entries for the given participant and
 * writes them into a PDF document with a simple Caremax header.  It
 * returns a Promise that resolves with a Buffer containing the PDF
 * contents.
 *
 * @param {ObjectId} participantId Mongoose ID of the participant
 * @returns {Promise<Buffer>} Buffer with PDF data
 */
async function buildParticipantReport(participantId) {
  const participant = await Participant.findById(participantId).lean();
  const timesheets = await Timesheet.find({ participant: participantId })
    .populate({ path: 'worker', populate: { path: 'user', select: 'name' } })
    .lean();
  const notes = await ProgressNote.find({ participant: participantId })
    .populate({ path: 'worker', populate: { path: 'user', select: 'name' } })
    .lean();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.fontSize(26).text('Caremax Support Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Participant: ${participant?.name || participantId}`);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`);
    doc.moveDown(2);

    // Progress notes section
    doc.fontSize(20).text('Progress Notes', { underline: true });
    doc.moveDown();
    if (!notes.length) {
      doc.fontSize(12).text('No progress notes found.', { italic: true });
    } else {
      notes.forEach((note, idx) => {
        const workerName = note.worker?.user?.name || note.worker?.name || note.worker;
        doc.fontSize(14).fillColor('black').text(`${idx + 1}. Date: ${new Date(note.date).toLocaleDateString()} | Worker: ${workerName}`);
        doc.fontSize(12).fillColor('gray').text(note.note, { indent: 20, width: 500 });
        doc.moveDown(0.5);
      });
    }
    doc.addPage();

    // Timesheets section
    doc.fontSize(20).fillColor('black').text('Timesheets', { underline: true });
    doc.moveDown();
    if (!timesheets.length) {
      doc.fontSize(12).text('No timesheets found.', { italic: true });
    } else {
      timesheets.forEach((ts, idx) => {
        const workerName = ts.worker?.user?.name || ts.worker?.name || ts.worker;
        doc.fontSize(14).fillColor('black').text(`${idx + 1}. Date: ${new Date(ts.date).toLocaleDateString()} | Worker: ${workerName} | Hours: ${ts.hours} | Status: ${ts.status}`);
        if (ts.notes) {
          doc.fontSize(12).fillColor('gray').text(`Notes: ${ts.notes}`, { indent: 20 });
        }
        doc.moveDown(0.5);
      });
    }
    doc.end();
  });
}

// Generate PDF report for a participant and return it to the caller
router.get('/participant/:id/pdf', protect, async (req, res) => {
  try {
    const pdfBuffer = await buildParticipantReport(req.params.id);
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="participant_${req.params.id}_report.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to generate report' });
  }
});

// Generate PDF and email it to a provided address
router.post('/participant/:id/send', protect, authorize('admin'), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email address is required' });
    const pdfBuffer = await buildParticipantReport(req.params.id);

    // Create transporter using SMTP settings from environment
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, // true for port 465, false for others
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Your Caremax Support Report',
      text: 'Please find attached your Caremax support report.',
      attachments: [
        {
          filename: `participant_${req.params.id}_report.pdf`,
          content: pdfBuffer
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Report emailed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to send report' });
  }
});

module.exports = router;