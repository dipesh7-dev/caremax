const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/participants', require('./routes/participants'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/timesheets', require('./routes/timesheets'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/cms', require('./routes/cms'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/progress-notes', require('./routes/progressNotes'));
app.use('/api/leave-requests', require('./routes/leaveRequests'));
app.use('/api/messages', require('./routes/messages'));

// New routes for services and reports
app.use('/api/services', require('./routes/services'));
app.use('/api/reports', require('./routes/reports'));

// Root route
app.get('/', (req, res) => {
  res.send('NDIS backend API running');
});

// Create default admin and worker if none exist
const User = require('./models/User');
const Worker = require('./models/Worker');
const createDefaultUsers = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({ name: 'Admin', email: 'admin@ndis.com', password: 'Admin@123', role: 'admin' });
      await admin.save();
      console.log('Default admin created');
    }
    const workerUserExists = await User.findOne({ email: 'worker@ndis.com' });
    if (!workerUserExists) {
      const workerUser = new User({ name: 'Worker', email: 'worker@ndis.com', password: 'Worker@123', role: 'worker' });
      await workerUser.save();
      const worker = new Worker({ user: workerUser._id });
      await worker.save();
      console.log('Default worker created');
    }
  } catch (err) {
    console.error('Error seeding default users', err);
  }
};

// After DB connection, seed default users
createDefaultUsers();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});