import express from 'express';
import requesterController from './controller.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.post('/register-requester', requesterController.registerNewRequester);
router.post('/login-requester', requesterController.loginRequester);
router.put("/update-requester", auth, requesterController.updateRequesterData);
export default router;

