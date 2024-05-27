import express from 'express';
import requiredServices from "../requiredServices/controller.js";
import auth from '../../middleware/auth.js';
const router = express.Router();

router.post("/new-required-service", requiredServices.newRequiredService);
router.get("/list-my-solicitations", requiredServices.listMySolicitations);
router.get("/list-my-solicitations/:status", requiredServices.listMySolicitationsByStatus);
router.get("/list-solicitations-by-provider/:status", auth, requiredServices.listSolicitationByProviderAndStatus);
router.get("/list-solicitations-by-requester", auth, requiredServices.listAllSolicitationByRequester);
router.patch("/update-status/:solicitationId/:status", auth, requiredServices.updateSolicitation);

export default router;

