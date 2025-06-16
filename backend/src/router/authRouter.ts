import { Router } from 'express';
import { body } from 'express-validator';
import { register as register_auth, login as login_auth } from '../controllers/authController';
import { handleInputErrors as handleInputErrors_auth } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { getUser } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/register',
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password debe contener al menos 8 caracteres')
        .matches(/\d/).withMessage('El password debe contener al menos un número')
        .matches(/[a-z]/).withMessage('El password debe contener al menos una letra minúscula')
        .matches(/[A-Z]/).withMessage('El password debe contener al menos una letra mayúscula'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los passwords no coinciden');
        }
        return true;
    }),
    handleInputErrors_auth,
    register_auth
);

authRouter.post('/login',
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors_auth,
    login_auth
);

authRouter.get('/user', authenticate, getUser);


export default authRouter;