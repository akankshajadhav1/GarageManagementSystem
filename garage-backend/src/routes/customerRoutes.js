const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateCustomer } = require('../utils/validators');

router.use(protect);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of customers
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Customer created
 */
router
  .route('/')
  .get(authorize('admin', 'manager', 'receptionist', 'mechanic'), getCustomers)
  .post(authorize('admin', 'manager', 'receptionist'), validateCustomer, createCustomer);

router
  .route('/:id')
  .get(authorize('admin', 'manager', 'receptionist', 'mechanic'), getCustomer)
  .put(authorize('admin', 'manager', 'receptionist'), updateCustomer)
  .delete(authorize('admin', 'manager'), deleteCustomer);

module.exports = router;
