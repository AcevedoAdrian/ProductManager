import { Router } from 'express';
import { getLoggerController } from '../controllers/logger.controller.js';

const router = Router();
router.get('/', getLoggerController);

export default router;
