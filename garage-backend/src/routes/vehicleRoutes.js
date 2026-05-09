const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateVehicle } = require('../utils/validators');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'manager', 'receptionist', 'mechanic'), getVehicles)
  .post(authorize('admin', 'manager', 'receptionist'), validateVehicle, createVehicle);

router
  .route('/:id')
  .get(authorize('admin', 'manager', 'receptionist', 'mechanic'), getVehicle)
  .put(authorize('admin', 'manager', 'receptionist', 'mechanic'), updateVehicle)
  .delete(authorize('admin', 'manager'), deleteVehicle);

module.exports = router;
