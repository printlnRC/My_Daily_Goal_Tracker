import { Router } from 'express';
import { goalController } from '../controllers/goalController.js';

const router = Router();

// Quand on reçoit un POST sur "/" (qui sera /api/goals)
router.post('/', goalController.create);

// Quand on reçoit un GET sur "/"
router.get('/', goalController.findAll);

// Route pour mettre à jour le statut "completed"
router.patch('/:id', goalController.toggle);
export default router;