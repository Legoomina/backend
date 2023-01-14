import prisma from '../prismaClient.js'
import * as googleService from '../services/google.service.js'
import { google } from 'googleapis'
import { cache } from '../cache.js'


export const authCalendar = async (req, res) => {

    const url = googleService.auth.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar', 'profile', 'email']
    })
    res.redirect(url)
}

export const getCalendarEvents = async (req, res) => {

    console.log(req.id);
    const redisAccessTokenKey = `google:calendar:${req.id}:accessToken`
    const googleAccessToken = await cache.get(redisAccessTokenKey)

    if(!googleAccessToken) {
        return res.status(401).send({'message': 'Did not find tokens in cache, could not get calendar events'})
    }

    const credentials = {
        access_token: googleAccessToken,
        token_type: 'Bearer'
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

    const parsedEvents = events.data.items.map(e => {
        return {id: e.id, summary: e.summary, start: e.start, end: e.end}
    })

    await cache.set(`google:calendar:events:${req.id}`, JSON.stringify(parsedEvents), {EX: 3600})

    res.send(parsedEvents);
};