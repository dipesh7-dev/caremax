const express = require('express');
const Incident = require('../models/Incident');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get incidents
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'worker') {
      query.worker = req.user._id;
    }
    const incidents = await Incident.find(query).populate('participant').populate('worker');
    res.json(incidents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create incident (worker or admin)
router.post('/', protect, async (req, res) => {
  try {
    // Worker automatically sets worker field
    let payload = { ...req.body };
    if (req.user.role === 'worker') {
      payload.worker = req.user._id;
    }
    const incident = await Incident.create(payload);
    res.status(201).json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update incident status (admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });
    incident.status = req.body.status || incident.status;
    await incident.save();
    res.json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;