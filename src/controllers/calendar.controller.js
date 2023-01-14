import prisma from '../prismaClient.js'
import * as google from '../services/google.service.js'

export const getCalendar = async (req, res) => {
    
    const url = google.auth.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events.readonly']
    })
    res.redirect(url)
}