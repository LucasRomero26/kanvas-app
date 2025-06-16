import { Router } from 'express'
import { body, param } from 'express-validator'
import { createTask, getBoardTasks, getTaskById, updateTaskById, updateTaskStatus, deleteTaskById } from '../controllers/taskController'
import { handleInputErrors } from '../middleware/validation'
import Task, { TaskStatus, taskStatus } from '../models/Task'

const router = Router({ mergeParams: true })

// Middleware para validar que una tarea exista y pertenezca al tablero
router.param('taskId', async (req, res, next, id) => {
    try {
        const task = await Task.findById(id)
        if (!task) {
            const error = new Error('Tarea no encontrada')
            return res.status(404).json({ error: error.message })
        }
        // Verificación de seguridad
        if (!req.board) {
            const error = new Error('Tablero no encontrado')
            return res.status(404).json({ error: error.message })
        }
        if (task.board.toString() !== req.board.id) {
            const error = new Error('Acción no válida')
            return res.status(403).json({ error: error.message })
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
})

// Rutas para Tareas
router.post('/',
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    createTask
)

router.get('/', getBoardTasks)

router.get('/:taskId',
    param('taskId').isMongoId().withMessage('ID de tarea no válido'),
    handleInputErrors,
    getTaskById
)

router.put('/:taskId',
    param('taskId').isMongoId().withMessage('ID de tarea no válido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    updateTaskById
)

router.patch('/:taskId/status',
    param('taskId').isMongoId().withMessage('ID de tarea no válido'),
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    // Validación para asegurar que el status sea uno de los permitidos
    body('status').isIn(Object.values(taskStatus)).withMessage('Estado no válido'),
    handleInputErrors,
    updateTaskStatus
)

router.delete('/:taskId',
    param('taskId').isMongoId().withMessage('ID de tarea no válido'),
    handleInputErrors,
    deleteTaskById
)

export default router