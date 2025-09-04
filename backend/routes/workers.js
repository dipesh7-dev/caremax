const express = require('express');
const Worker = require('../models/Worker');
const User = require('../models/User');
const Participant = require('../models/Participant');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all workers
router.get('/', protect, async (req, res) => {
  try {
    const workers = await Worker.find().populate('user', '-password');
    res.json(workers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create worker (admin) - expects user info and worker details
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, phone, address, photoUrl, availability } = req.body;
    // Create user
    const user = new User({ name, email, password, role: 'worker', phone, address, photoUrl });
    await user.save();
    // Create worker
    const worker = new Worker({ user: user._id, availability });
    await worker.save();
    res.status(201).json(await worker.populate('user', '-password'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single worker
router.get('/:id', protect, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate('user', '-password').populate('assignedParticipants');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update worker
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    // update worker-specific fields
    Object.assign(worker, req.body);
    await worker.save();
    res.json(await worker.populate('user', '-password'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete worker (remove user as well)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    // remove associated user
    await User.findByIdAndDelete(worker.user);
    await worker.deleteOne();
    res.json({ message: 'Worker removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign participant to worker
router.post('/:id/assign', protect, authorize('admin'), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    const { participantId } = req.body;
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    const participant = await Participant.findById(participantId);
    if (!participant) return res.status(404).json({ message: 'Participant not found' });
    if (!worker.assignedParticipants.includes(participantId)) {
      worker.assignedParticipants.push(participantId);
      await worker.save();
    }
    res.json(await worker.populate('assignedParticipants'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assigned participants for current worker
router.get('/me/participants', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id }).populate('assignedParticipants');
    if (!worker) return res.json([]);
    res.json(worker.assignedParticipants || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current worker profile
router.get('/me', protect, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ user: req.user._id }).populate('user', '-password').populate('assignedParticipants');
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;