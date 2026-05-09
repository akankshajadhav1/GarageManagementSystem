const express = require('express');
const router = express.Router();
const {
  getServiceRequests,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateServiceRequest } = require('../utils/validators');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'manager', 'receptionist', 'mechanic'), getServiceRequests)
  .post(authorize('admin', 'manager', 'receptionist'), validateServiceRequest, createServiceRequest);

router
  .route('/:id')
  .get(authorize('admin', 'manager', 'receptionist', 'mechanic'), getServiceRequest)
  .put(authorize('admin', 'manager', 'receptionist', 'mechanic'), updateServiceRequest)
  .delete(authorize('admin', 'manager'), deleteServiceRequest);

module.exports = router;
