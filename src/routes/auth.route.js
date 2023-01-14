import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import passport from 'passport';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/refresh', AuthController.refreshToken);
router.get('/login/google', passport.authenticate('google', { scope: [ 'email' ] } ));

export default router;