import express from 'express';
import { checkAuth, ForgetPassword, login, logout, resetPassword, signup, verifyEmail } from '../controllers/auth.controllers.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', ForgetPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/check-auth', verifyToken, checkAuth)


export default router;