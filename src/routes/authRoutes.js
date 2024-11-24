import express from 'express';
import { loginUser,signUp } from 'modules/auth/controller';

const router = express.Router();

router.post('/signup', signUp); 
router.post('/login', loginUser); 

export default router;
