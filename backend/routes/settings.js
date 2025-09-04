const express = require('express');
const Setting = require('../models/Setting');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get settings (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) setting = await Setting.create({});
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (admin)
router.put('/', protect, authorize('admin'), async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) setting = new Setting({});
    Object.assign(setting, req.body);
    await setting.save();
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;