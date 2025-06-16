import { Request as Request_val, Response as Response_val, NextFunction as NextFunction_val } from 'express';
import { validationResult } from 'express-validator';

export const handleInputErrors = (req: Request_val, res: Response_val, next: NextFunction_val) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
}