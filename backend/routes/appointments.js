const express = require('express');
const Appointment = require('../models/Appointment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all appointments (admin) or worker's appointments
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'worker') {
      query.worker = req.user._id;
    }
    const appointments = await Appointment.find(query).populate('participant').populate({ path: 'worker', populate: { path: 'user', select: '-password' } });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create appointment (admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment (admin or worker) - for status or workerResponse
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    // Workers can only update workerResponse on their own appointments
    if (req.user.role === 'worker') {
      if (appointment.worker.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      appointment.workerResponse = req.body.workerResponse || appointment.workerResponse;
    } else if (req.user.role === 'admin') {
      // Admin can update status and workerResponse
      Object.assign(appointment, req.body);
    }
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete appointment (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;