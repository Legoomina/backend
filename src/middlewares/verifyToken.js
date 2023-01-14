import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(token===undefined) return res.status(401).send({ message: 'Unauthorized!' });

    let validatedToken = jwt.decode(token);
    if (validatedToken?.hasOwnProperty('id') && validatedToken.type === 'accessToken') {
        req.id = validatedToken.id;
        req.email = validatedToken.email;
        next();
    } else {
        return res.status(401).send({ message: 'Unauthorized!' });
    }
}