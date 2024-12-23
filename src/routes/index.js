import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js'
import categoryRoutes from "./categoryRoutes.js"
import itemRoutes from './itemsRoutes.js';
import salesRoutes from './salesRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes); 
router.use('/users', userRoutes)
router.use('/category', categoryRoutes);
router.use('/items', itemRoutes);
router.use('/sales', salesRoutes);



export default router;
