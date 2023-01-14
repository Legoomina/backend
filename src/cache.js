import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config({path: './.env'});

export const cache = createClient({url: process.env.REDIS_URL});
cache.connect();
cache.on('error', (err) => {
    console.log('Redis client error:', err);
})
cache.on('connect', () => {
    console.log('Redis client connected');
})