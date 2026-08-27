import express from 'express';
import { getAll, getById, create, update, remove } from '../controllers/crud.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = express.Router();

// Apply auth middleware to all CRUD routes
router.use(requireAuth);

// Generic CRUD endpoints mapped by model name (e.g. /api/workOrder)
router.get('/:model', getAll);
router.get('/:model/:id', getById);
router.post('/:model', create);
router.put('/:model/:id', update);
router.delete('/:model/:id', remove);

export default router;
