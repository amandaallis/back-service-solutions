import express from 'express';
import serviceType  from './controller.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get('/all-services',auth, serviceType.getAllService);
router.get('/all-services-type', serviceType.getAllService);
router.post("/new-type-service", auth, serviceType.newService)
router.get('/available-provider/:service', serviceType.availableProvidersByService);
router.get('/service/:id', serviceType.findServiceById)
export default router;

