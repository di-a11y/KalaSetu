import express from 'express';
import {
    loginUser,
    registerUser,
    adminLogin,
    checkEmail,
    sendOtp,
    verifyOtp,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// NEW: routes backing the buyer page's email-first signup/login flow.
userRouter.post('/check-email', checkEmail);
userRouter.post('/send-otp', sendOtp);
userRouter.post('/verify-otp', verifyOtp);

export default userRouter;
