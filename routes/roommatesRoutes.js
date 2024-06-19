import { Router } from 'express';
import { getRoommates, addRoommate } from '../controllers/roommatesController.js';

const router = Router();

router.get('/', getRoommates);
router.post('/', addRoommate);

export default router;
