import express from 'express';
import requiredServices from "../requiredServices/controller.js";
const router = express.Router();

router.post("/new-required-service", requiredServices.newRequiredService)
router.get("/list-my-solicitations", requiredServices.listMySolicitations)
router.get("/list-my-solicitations/:status", requiredServices.listMySolicitationsByStatus)


export default router;

