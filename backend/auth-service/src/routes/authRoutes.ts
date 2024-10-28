import express from 'express';
import  {login, register } from '../controllers/authController';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route example (e.g., ADMIN only)

export default router;
