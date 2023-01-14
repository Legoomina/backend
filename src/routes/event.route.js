import { Router } from "express";
import * as EventController from "../controllers/event.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = Router();

router.get('/filter', verifyToken, EventController.filterEvents);
// router.post('/', verifyToken, EventController.createEvent);

export default router;