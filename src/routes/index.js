import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js'
import categoryRoutes from "./categoryRoutes.js"

const router = express.Router();

router.use('/auth', authRoutes); 
router.use('/users', userRoutes)
router.use('/category', categoryRoutes);

export default router;
