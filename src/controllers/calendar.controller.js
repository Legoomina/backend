import prisma from '../prismaClient.js'
import * as googleService from '../services/google.service.js'
import { google } from 'googleapis'

export const authCalendar = async (req, res) => {

    const url = googleService.auth.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events.readonly']
    })
    res.redirect(url)
}

export const getCalendarEvents = async (req, res) => {
    const credentials = {
        access_token: req.body.access_token,
        token_type: 'Bearer',
        refresh_token: req.body.refresh_token,
        expiry_date: req.body.expiry_date
    }

    googleService.auth.setCredentials(credentials)
    const calendar = google.calendar({ version: 'v3', auth: googleService.auth })
    const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        timeMax: (new Date(+new Date() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    })
    console.log('events: ', events)
    res.send(events.data.items.map(event => {
        return {
            id: event.id,
            summary: event.summary,
            start: event.start.dateTime,
            end: event.end.dateTime,
        }
    }));
};