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
    (accessToken, refreshToken, profile, cb) => {
        // console.log('profile: ', profile);
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
                prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        origin: 'google'
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