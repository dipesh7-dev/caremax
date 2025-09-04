const express = require('express');
const CMS = require('../models/CMS');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get content
router.get('/', protect, async (req, res) => {
  try {
    const content = await CMS.find();
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create content (admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await CMS.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content (admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await CMS.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Content not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await CMS.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Content not found' });
    res.json({ message: 'Content removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;