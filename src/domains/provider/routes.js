import express from 'express';
import registerNewProvider from './controller.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.post('/register-provider', registerNewProvider.registerNewProvider);
router.post('/login-provider', registerNewProvider.loginProvider);
router.put("/update-provider", auth, registerNewProvider.updateProviderData);
router.get("/email-alredy-registred",registerNewProvider.emailRegistered);
router.get("/phone-alredy-registred",registerNewProvider.phoneRegistered);
router.get("/user-info", auth, registerNewProvider.getUserInformation)

export default router;

