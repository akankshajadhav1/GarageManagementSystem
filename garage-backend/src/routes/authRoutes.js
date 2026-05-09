const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../utils/validators');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, manager, mechanic, receptionist]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post('/register', validateRegister, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, login);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;
