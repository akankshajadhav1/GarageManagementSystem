const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./src/app');

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/garageDB')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});
