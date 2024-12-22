import express from 'express';
import * as item from '../modules/items/controller.js';
import { authenticate } from '../core/middlewares/middleware.js';

const router = express.Router();

router.post('/addItem', authenticate, item.create);
router.get('/', authenticate, item.getItems);
router.get('/:itemID', authenticate, item.getItem);
router.put('/:itemID', authenticate, item.updateItemDetails);
router.delete('/:itemID', authenticate, item.removeItem);

export default router;