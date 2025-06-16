import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { IBoard } from '../models/Board';
import { ITask } from '../models/Task';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            board?: IBoard;
            task?: ITask; // <- AÑADE ESTA LÍNEA
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(401).json({ error: 'No Autorizado' });
        return; // ¡Importante! Usar return aquí.
    }

    const [, token] = bearer.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        
        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                next(); // Llama a next() y luego...
                return; // ...finaliza la función.
            }
        }
        res.status(404).json({ error: 'Token No Válido o Usuario no encontrado' });
        
    } catch (error) {
        res.status(401).json({ error: 'Token No Válido' });
    }
}