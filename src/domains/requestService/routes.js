import express from 'express';
import requestService from "../requestService/controller.js";

const router = express.Router();

router.get('/available-provider/:service', requestService.availableProvidersByService);

export default router;
