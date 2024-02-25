import express from 'express';
import registerNewProvider from './controller.js';

const router = express.Router();

router.post('/register-provider', registerNewProvider.registerNewProvider);
router.post('/login-provider', registerNewProvider.loginProvider);
export default router;

