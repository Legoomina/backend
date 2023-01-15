import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from "./prismaClient.js";
import dotenv from 'dotenv';

dotenv.config({path: './.env'});

passport.serializeUser((user, cb) => {
    process.nextTick(function() {
        cb(null, {
            id: user.id,
            name: user.name,
            email: user.email
        });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(function() {
        return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/oauth2/redirect/google',
    scope: [ 'profile' ],
},
    (accessToken, refreshToken, profile, cb) => {6
        prisma.user.findFirst({
            where: {
                email: profile.emails[0].value
            }
        }).then(user => {
            if (user) {
                return cb(null, {
                    id: user.id,
                    email: user.email
                });
            } else {
                let firstName, lastName
                try {
                    firstName = profile.displayName.split(' ')[0];
                    lastName = profile.displayName.split(' ')[1];
                } catch (err) {
                    firstName = null;
                    lastName = null;
                }
                prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        origin: 'google',
                        avatar: profile.photos[0].value,
                        firstName: firstName,
                        lastName: lastName
                    }
                }).then(user => {
                    return cb(null, {
                        id: user.id,
                        email: user.email
                    });
                }).catch(err => {
                    console.log('err: ', err);
                    return cb(err);
                });
            }
        }).catch(err => {
            console.log('err: ', err);
            return cb(err);
        });
    }
));