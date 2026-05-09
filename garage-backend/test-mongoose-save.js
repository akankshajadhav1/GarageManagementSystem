const mongoose = require('mongoose');
const User = require('./src/models/User');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/garage-test', { useNewUrlParser: true });
  try {
    const user = new User({ username: 'test1', email: 'test1@test.com', password: 'password123' });
    await user.save();
    console.log('User saved successfully');
  } catch (err) {
    console.error('Save error:', err.message);
  }
  mongoose.disconnect();
}
run();
