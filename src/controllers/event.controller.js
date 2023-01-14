import prisma from '../prismaClient.js'
import { cache } from '../cache.js'
import * as googleService from '../services/google.service.js'
import { google } from 'googleapis'

export const filterEvents = async (req, res) => {
    const id = req.id;
    console.log(id);

    const validQueries = ['range', 'category']
    console.log(req.query);
    if (Object.keys(req.query).includes(validQueries)) return res.status(400).json({ message: "Query is required" });
    if (req.query.range) {
        if (isNaN(req.query.range)) return res.status(400).json({ message: "Range must be a number" });
    } else {
        req.query.range = 5;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    
    
    let teachers;
    if(req.query.category) {
        teachers = await prisma.teacher.findMany({
            where: {
                NOT: {
                    userId: parseInt(id)
                }
            }
        });
        teachers = teachers.filter(teacher => {
            let queryCategory = req.query.category.split(",");
            for (let i = 0; i < queryCategory.length; i++) {
                if (teacher.categories.includes(queryCategory[i])) return teacher;
            }
        });
    } else {
        teachers = await prisma.teacher.findMany({
            where: {
                NOT: {
                    userId: parseInt(id)
                }
            }
        });
    }
    
    console.log(teachers);
    
    const teacherLocations = await Promise.all(teachers.map(async (teacher) => {
        const user = await prisma.user.findUnique({
            where: {
                id: teacher.userId
            }
        });
        return {id: user.id, location: user.location};
    }))
    // console.log(locations);
    
    const filterRange = (locations, range) => {
        const location = user.location;
        
        let userLat = location.split(",")[0];
        userLat = userLat.replace("@",'');
        userLat = parseFloat(userLat);
        let userLon = location.split(",")[1];
        userLon = parseFloat(userLon);
        
        let lat = locations.split(",")[0];
        lat = lat.replace("@",'');
        lat = parseFloat(lat);
        let lon = locations.split(",")[1];
        lon = parseFloat(lon);

        
        const distance = Math.acos(Math.sin(userLat)*Math.sin(lat)+Math.cos(userLat)*Math.cos(lat)*Math.cos(lon-userLon))*6371
        console.log(distance);
        return distance ? distance <= range : false;
    }

    const parsedTeachers = teacherLocations.filter(teacher => {
        const distance = filterRange(teacher.location, req.query.range);
        console.log(distance);
        if (distance) return teacher;
    })
    // TODO WYCIAGNAC Z BAZY EVENTY TEACHEROW

    res.status(200).json(parsedTeachers);
}


export const createEvent = async (req, res) => {
    const id = req.id;
    
    const redisKey = `google:calendar:${id}:accessToken`;
    const accessToken = await cache.get(redisKey);
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

    const { date, time, duration, category, description } = req.body;
    if (!date || !time || !duration || !category || !description) return res.status(400).json({ message: "All fields are required" });
    if (isNaN(duration)) return res.status(400).json({ message: "Duration must be a number" });




    /* const teacher = await prisma.teacher.findUnique({
        where: {
            userId: parseInt(req.id)
        }
    }); 
    if (!teacher) return res.status(404).json({ message: "Teacher not found" }); */


    const credentials = {
        access_token: accessToken,
        token_type: 'Bearer'
    }

    const calendar = google.calendar({ version: 'v3', auth: credentials });
    const event = {
        summary: category,
        description: description,
        start: {
            dateTime: new Date(date + time),
            timeZone: 'Europe/Warsaw'
        },
        end: {
            dateTime: new Date(date + time + duration),
            timeZone: 'Europe/Warsaw'
        },
    };

    const eventStatus = calendar.events.insert({
        auth: credentials,
        calendarId: 'primary',
        resource: event,
    }, (err, event) => {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event created: %s', event.htmlLink);
    });

    if (!eventStatus) return res.status(400).json({ message: "Event not created" });
    return res.status(200).json({ message: "Event created" });
}