import express from 'express';
import bcrypt from 'bcrypt';
import requesterController from './controller.js';

const router = express.Router();

router.post('/register', requesterController.registerNewRequester)

export default router;

