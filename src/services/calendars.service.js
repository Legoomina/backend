import * as googleService from '../services/google.service.js'
import { google } from 'googleapis'
import { cache } from '../cache.js'
import prisma from '../prismaClient.js';

export const updateTeacherCalendarEvents = async (teacherId) => {
    console.log('updateTeacherCalendarEvents', teacherId);
    if (!teacherId) {
        return new Error('No teacherId provided');
    }
    const teacher = await prisma.teacher.findUnique({
        where: {
            id: parseInt(teacherId)
        }
    });

    const redisAccessTokenKey = `google:calendar:${teacher.userId}:accessToken`
    const googleAccessToken = await cache.get(redisAccessTokenKey);

    if(!googleAccessToken) {
        return new Error('Did not find tokens in cache, could not get calendar events');
    }

    const redisKeyUpToDateKey = `google:calendar:upToDate`;
    const redisKeyUpToDate = await cache.get(redisKeyUpToDateKey);

    if (redisKeyUpToDate) {
        return;
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

    for (const event of parsedEvents) {
        try {
            const eventExists = await prisma.event.findUnique({
                where: {
                    id: event.id
                }
            });
            console.log('eventExists', event.summary);
            if (!eventExists) {
                let name = event.summary.match(/\s[a-zA-Z]{1,50}/gm);
                if (name.length) {
                    try{
                        name = name.at(0).trim()
                    } catch (e) {
                        name = name[0].trim()
                    }
                } else {
                    name = 'No name';
                }
                let price = event.summary.match(/[0-9]{1,5}/gm);
                if (price.length) {
                    try {
                        price = parseInt(price.at(0));
                    } catch (e) {
                        price = parseInt(price[0]);
                    }
                } else {
                    price = 0;
                }
                await prisma.event.create({
                    data: {
                        id: event.id,
                        name: name,
                        startDate: new Date(event.start.dateTime).toISOString(),
                        endDate: new Date(event.end.dateTime).toISOString(),
                        teacherId: teacher.id,
                        price: price
                    }
                });
            } else {
                let name = event.summary.match(/\s[a-zA-Z]{1,50}/gm);
                if (name.length) {
                    try{
                        name = name.at(0).trim()
                    } catch (e) {
                        name = name[0].trim()
                    }
                } else {
                    name = 'No name';
                }
                let price = event.summary.match(/[0-9]{1,5}/gm);
                if (price.length) {
                    try {
                        price = parseInt(price.at(0));
                    } catch (e) {
                        price = parseInt(price[0]);
                    }
                } else {
                    price = 0;
                }
                await prisma.event.update({
                    where: {
                        id: event.id
                    },
                    data: {
                        name: name,
                        startDate: new Date(event.start.dateTime).toISOString(),
                        endDate: new Date(event.end.dateTime).toISOString(),
                        price: price
                    }
                });
            }
        } catch (error) {
            console.log(error);
            continue;
        }
    }
    // cache.set(redisKeyUpToDateKey, 'true', {EX: 900});
};