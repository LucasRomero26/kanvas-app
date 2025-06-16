import { Request, Response } from 'express';
import UserModel, { IUser } from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateJWT } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    try {
        const userExists = await UserModel.findOne({ email: req.body.email });
        if (userExists) {
            res.status(409).json({ error: 'El email ya está registrado' });
            return;
        }

        const user = new UserModel(req.body);
        user.password = await hashPassword(req.body.password);
        await user.save();
        
        res.status(201).send('Usuario Creado Correctamente, ya puedes iniciar sesión');
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne<IUser>({ email });

        if (!user) {
            res.status(404).json({ error: 'El usuario no existe' });
            return; 
        }
        
        const isPasswordCorrect = await checkPassword(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).json({ error: 'Password Incorrecto' });
            return; 
        }

        // ↓↓↓ ¡AQUÍ ESTÁ LA SOLUCIÓN DEFINITIVA! ↓↓↓
        // Usamos '(user._id as any)' para forzar a TypeScript a ignorar el error de tipo.
        const token = generateJWT({ id: (user._id as any).toString() });
        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al iniciar sesión' });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'});
    }
}