import { Router } from "express";
import * as CalendarController from "../controllers/calendar.controller.js";

const router = Router();

router.get("/", CalendarController.getCalendar);

export default router;