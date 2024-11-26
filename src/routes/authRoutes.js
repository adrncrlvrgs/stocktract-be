import express from 'express';
import * as authController from '../modules/auth/controller.js';

const router = express.Router();

router.post('/signup', authController.signUp); 
router.post('/login', authController.loginUser); 

export default router;
