const express = require('express');
const LeaveRequest = require('../models/LeaveRequest');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get leave requests
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'worker') {
      query.worker = req.user._id;
    }
    const requests = await LeaveRequest.find(query).populate('worker');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create leave request (worker)
router.post('/', protect, authorize('worker'), async (req, res) => {
  try {
    const request = await LeaveRequest.create({ ...req.body, worker: req.user._id });
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update leave request status (admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Leave request not found' });
    request.status = req.body.status || request.status;
    await request.save();
    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;