import express from 'express';
import bcrypt from 'bcrypt';
import requesterController from './controller.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.post('/register-requester', requesterController.registerNewRequester);
router.post('/login-requester', requesterController.loginRequester);
export default router;

