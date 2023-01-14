import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import session from 'express-session';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import './authenticate.js';
import authRoutes from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import teacherRouter from './routes/teacher.route.js';
import categoryRouter from './routes/category.route.js';
import calendarRouter from './routes/calendar.route.js';


import * as jwt from './services/jwt.service.js'; 
import * as google from './services/google.service.js';

dotenv.config({path: './.env'});

const app = express();
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(bodyParser.json());
app.use(morgan('<:remote-addr> :remote-user |:method :url - :status| :user-agent :response-time ms [:date[iso]]'));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/category', categoryRouter);
app.use('/api/calendar', calendarRouter);


app.get('/', (req, res) => {
    res.send({ message: 'root of app'});
});

app.get('/error', (req, res) => {
    res.send({message: 'google oauth error'});
});


app.get('/oauth2/redirect/google', passport.authenticate('google', { failureRedirect: '/error', failureMessage: true }), (req, res) => {
    
    console.log('req: ', req);
    console.log('req.user: ', req.user);
    const tokens = jwt.createTokens(req.user);

    let getParams = '?accessToken=' + tokens.accessToken + '&refreshToken=' + tokens.refreshToken;

    // res.redirect('http://localhost:3000/login/success'+getParams);
    res.send({message: 'google oauth success', tokens: tokens});
});

app.get('/oauth2/calendar', async (req, res) => {
    
    console.log('req: ', req.query.code);
    const a = await google.getAccessToken(req.query.code);
    console.log('accessToken: ', a);
    // res.redirect('http://localhost:3000/login/success'+getParams);
    // res.send({message: 'google oauth calendar'});
    res.send({message: 'google oauth calendar', accessToken: a});
});

app.listen(3001, () => {
    console.log('Server started on port', 3001);
});