import { updateTeacherCalendarEvents } from "../services/calendars.service.js";
import prisma from "../prismaClient.js";

export const updateTeachersCalendarEvents = async (req, res, next) => {
    try {
        const teachers = await prisma.teacher.findMany();
        for (const teacher of teachers) {
            updateTeacherCalendarEvents(teacher.id);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
    next();
};
