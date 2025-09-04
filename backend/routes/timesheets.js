const express = require('express');
const Timesheet = require('../models/Timesheet');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get timesheets
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'worker') {
      query.worker = req.user._id;
    }
    const timesheets = await Timesheet.find(query).populate('participant').populate('worker');
    res.json(timesheets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create timesheet (worker)
router.post('/', protect, authorize('worker'), async (req, res) => {
  try {
    const timesheet = await Timesheet.create({ ...req.body, worker: req.user._id });
    res.status(201).json(timesheet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update timesheet (admin - approve/reject)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);
    if (!timesheet) return res.status(404).json({ message: 'Timesheet not found' });
    timesheet.status = req.body.status || timesheet.status;
    await timesheet.save();
    res.json(timesheet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete timesheet (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ts = await Timesheet.findByIdAndDelete(req.params.id);
    if (!ts) return res.status(404).json({ message: 'Timesheet not found' });
    res.json({ message: 'Timesheet removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;