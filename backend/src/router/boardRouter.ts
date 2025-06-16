import { Router } from 'express';
import { body, param } from 'express-validator';
import { createBoard, getAllBoards, getBoardById, updateBoardById, deleteBoardById } from '../controllers/boardController';
import { handleInputErrors } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import Board from '../models/Board';
import taskRouter from './taskRouter';

const boardRouter = Router();

boardRouter.use(authenticate);

boardRouter.param('boardId', async (req, res, next, id) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Acción no autorizada' });
        }
        
        // CORRECCIÓN: Añadimos .populate('tasks') para incluir los datos de las tareas
        const board = await Board.findById(id).populate('tasks');
        
        if (!board) {
            return res.status(404).json({ error: 'Tablero No Encontrado' });
        }
        
        if (!board.owner) {
            return res.status(500).json({error: 'Error: El tablero no tiene un propietario asignado.'})
        }

        if (board.owner.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Acción No Válida' });
        }
        req.board = board;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error en la validación del tablero' });
    }
});

boardRouter.use('/:boardId/tasks', taskRouter);

// -- Rutas CRUD --
boardRouter.post('/',
    body('name').notEmpty().withMessage('El nombre del tablero es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del tablero es obligatoria'),
    handleInputErrors,
    createBoard
);

boardRouter.get('/', getAllBoards);

boardRouter.get('/:boardId', 
    param('boardId').isMongoId().withMessage('ID de tablero no válido'),
    handleInputErrors,
    getBoardById
);

boardRouter.put('/:boardId',
    param('boardId').isMongoId().withMessage('ID de tablero no válido'),
    body('name').notEmpty().withMessage('El nombre del tablero es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del tablero es obligatoria'),
    handleInputErrors,
    updateBoardById
);

boardRouter.delete('/:boardId',
    param('boardId').isMongoId().withMessage('ID de tablero no válido'),
    handleInputErrors,
    deleteBoardById
);

export default boardRouter;