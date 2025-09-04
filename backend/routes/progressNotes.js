const express = require('express');
const ProgressNote = require('../models/ProgressNote');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get progress notes
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'worker') {
      // worker can see notes they created
      query.worker = req.user._id;
    }
    if (req.query.participant) {
      query.participant = req.query.participant;
    }
    const notes = await ProgressNote.find(query).populate('participant').populate('worker');
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create progress note (worker)
router.post('/', protect, authorize('worker'), async (req, res) => {
  try {
    const note = await ProgressNote.create({ ...req.body, worker: req.user._id });
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;