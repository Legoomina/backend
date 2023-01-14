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
import * as jwt from './services/jwt.service.js'; 
/* import productRoutes from './routes/product.route.js';
import {verifyToken} from './middlewares/verifyToken.js';*/


dotenv.config({path: './.env'});

const app = express();
app.use(cors({
    origin: 'http://localhost:3001',
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


app.get('/', (req, res) => {
    res.send({ message: 'root of app'});
});

app.get('/error', (req, res) => {
    res.send({message: 'google oauth error'});
});


app.get('/oauth2/redirect/google', passport.authenticate('google', { failureRedirect: '/error', failureMessage: true }), (req, res) => {
    console.log('req.user: ', req.user);
    const tokens = jwt.createTokens(req.user);

    let getParams = '?accessToken=' + tokens.accessToken + '&refreshToken=' + tokens.refreshToken;

    res.redirect('http://localhost:3000'+getParams);
    // res.send({message: 'google oauth success', tokens: tokens});
});

app.listen(3001, () => {
    console.log('Server started on port', 3001);
});