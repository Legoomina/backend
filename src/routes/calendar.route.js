import { Router } from "express";
import * as CalendarController from "../controllers/calendar.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = Router();

router.get('/', CalendarController.authCalendar);
router.get('/events', verifyToken, CalendarController.getCalendarEvents);

export default router;