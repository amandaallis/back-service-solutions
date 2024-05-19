import express from 'express';
import requiredServices from "../requiredServices/controller.js";
import auth from '../../middleware/auth.js';
const router = express.Router();

router.post("/new-required-service", requiredServices.newRequiredService);
router.get("/list-my-solicitations", requiredServices.listMySolicitations);
router.get("/list-my-solicitations/:status", requiredServices.listMySolicitationsByStatus);
router.get("/list-solicitations-by-provider", requiredServices.listSolicitationByProvider);

export default router;

