const express = require('express');
const Referral = require('../models/Referral');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public: create new referral
router.post('/', async (req, res) => {
  try {
    const referral = await Referral.create(req.body);
    res.status(201).json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all referrals (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const referrals = await Referral.find();
    res.json(referrals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update referral status (admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    if (!referral) return res.status(404).json({ message: 'Referral not found' });
    referral.status = req.body.status || referral.status;
    await referral.save();
    res.json(referral);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;