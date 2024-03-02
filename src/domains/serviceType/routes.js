import express from 'express';
import serviceType  from './controller.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get('/all-services',auth, serviceType.getAllService);

export default router;

