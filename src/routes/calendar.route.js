import { Router } from "express";
import * as CalendarController from "../controllers/calendar.controller.js";

const router = Router();

router.get('/', CalendarController.authCalendar);
router.get('/events', CalendarController.getCalendarEvents);

export default router;