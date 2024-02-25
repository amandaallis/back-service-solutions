import express from 'express';
import requesterController from './controller.js';

const router = express.Router();

router.post('/register-requester', requesterController.registerNewRequester);
router.post('/login-requester', requesterController.loginRequester);
export default router;

