import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config({path: './.env'})

export const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3001/oauth2/calendar"
);

export const getAccessToken = (code) => {
    return new Promise((resolve, reject) => {
        auth.getToken(code, (err, tokens) => {
            if (err) {
                reject(err)
            }
            resolve(tokens)
        })
    })
};
