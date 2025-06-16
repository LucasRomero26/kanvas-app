import jwt from 'jsonwebtoken';

export const generateJWT = (payload: { id: string }) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no definido en las variables de entorno');
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    return token;
}