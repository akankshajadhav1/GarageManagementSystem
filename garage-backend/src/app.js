const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import Swagger
const setupSwagger = require('./routes/swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Swagger API Documentation
setupSwagger(app);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Garage Management API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
