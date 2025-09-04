const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Worker = require('./models/Worker');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    // remove existing
    await User.deleteMany();
    await Worker.deleteMany();
    // create admin
    const admin = new User({
      name: 'Admin',
      email: 'admin@ndis.com',
      password: 'Admin@123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin created');
    // create worker user
    const workerUser = new User({
      name: 'Worker',
      email: 'worker@ndis.com',
      password: 'Worker@123',
      role: 'worker'
    });
    await workerUser.save();
    // create worker
    const worker = new Worker({ user: workerUser._id });
    await worker.save();
    console.log('Worker created');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();