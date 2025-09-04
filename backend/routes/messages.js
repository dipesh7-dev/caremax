const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get conversation between users.  If `userId` is omitted, all messages involving
// the current user are returned.  A special value of 'admin' for `userId`
// resolves to the first admin user in the database to simplify worker/admin
// communication without prior knowledge of the admin ID.
router.get('/', protect, async (req, res) => {
  try {
    let { userId } = req.query;
    // If special keyword 'admin' is provided, resolve it to an actual user id
    if (userId === 'admin') {
      const adminUser = await require('../models/User').findOne({ role: 'admin' });
      userId = adminUser ? adminUser._id : null;
    }
    if (!userId) {
      // return all messages where current user is involved
      const messages = await Message.find({
        $or: [ { sender: req.user._id }, { receiver: req.user._id } ]
      }).sort({ createdAt: 1 });
      return res.json(messages);
    }
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    return res.json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Send message.  The `receiver` field may be a user ID or the literal string
// 'admin' to automatically send to the first admin user.  A body is
// required.  Messages are saved with timestamps by the schema.
router.post('/', protect, async (req, res) => {
  try {
    let { receiver, body } = req.body;
    if (!receiver || !body) {
      return res.status(400).json({ message: 'Receiver and message body are required' });
    }
    // Resolve 'admin' keyword into the actual admin ID
    if (receiver === 'admin') {
      const adminUser = await require('../models/User').findOne({ role: 'admin' });
      receiver = adminUser ? adminUser._id : null;
      if (!receiver) return res.status(400).json({ message: 'No admin user exists' });
    }
    const messageDoc = await Message.create({ sender: req.user._id, receiver, body });
    return res.status(201).json(messageDoc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;