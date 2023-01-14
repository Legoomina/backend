import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path: './.env'});

export const createTokens = (user) => {
    const accessToken  = jwt.sign({ id: user.id, type: 'accessToken' }, process.env.TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ id: user.id, type: 'refreshToken'}, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
    return { accessToken, refreshToken };
}

export const refreshTokenService = async (token) => {
    const decodedToken = jwt.decode(token);
    if(decodedToken instanceof Object && decodedToken.type === 'refreshToken') {
        const tokens = createTokens(decodedToken);
        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    }
    return {}
}