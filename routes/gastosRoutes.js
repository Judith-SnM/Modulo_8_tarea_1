import { Router } from 'express';
import { getGastos, addGasto, updateGasto, deleteGasto } from '../controllers/gastosController.js';

const router = Router();

router.get('/', getGastos);
router.post('/', addGasto);
router.put('/', updateGasto);
router.delete('/', deleteGasto);

export default router;
