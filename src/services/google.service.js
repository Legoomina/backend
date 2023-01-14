import { google } from 'googleapis'
import dotenv from 'dotenv'
import fetch from 'cross-fetch'
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

export const getInfoAboutGoogleTokenBearer = async (token) => {
    auth.setCredentials({access_token: token});
    
    const info = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
    .then(json => json);

    return info;
    /* const a = await auth.userinfo.v2.me.get({auth: auth}, (err, res) => {
        if (err) {
            console.log('err: ', err);
        }
        console.log('res: ', res);
        return res;
    })
    return await a; */
    /* const person = await google.people('v1').people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names,photos',
        auth: auth
    }, (err, res) => {
        if (err) {
            console.log('err: ', err);
        }
        console.log('res: ', res);
        return res;
    })
    return await person; */
};