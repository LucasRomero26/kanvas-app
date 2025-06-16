import type { Request, Response } from 'express';
import Task from '../models/Task';

export const createTask = async (req: Request, res: Response) => {
    try {
        const task = new Task(req.body);
        // Aserción directa para acceder a las propiedades
        task.board = (req.board as any).id;
        (req.board as any).tasks.push(task.id);

        await Promise.allSettled([(req.board as any).save(), task.save()]);
        res.status(201).send('Tarea Creada Correctamente');
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al crear la tarea' });
    }
};

export const getBoardTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({ board: (req.board as any).id }).populate('board');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        res.json(req.task);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
};

export const updateTaskById = async (req: Request, res: Response) => {
    try {
        // Aserción directa para modificar propiedades
        (req.task as any).name = req.body.name;
        (req.task as any).description = req.body.description;
        await (req.task as any).save();
        res.send('Tarea Actualizada Correctamente');
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        (req.task as any).status = status;
        await (req.task as any).save();
        res.send('Estado de Tarea Actualizado');
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
};

export const deleteTaskById = async (req: Request, res: Response) => {
    try {
        // Aserción directa en ambos objetos
        (req.board as any).tasks = (req.board as any).tasks.filter(
            (task: any) => task.toString() !== (req.task as any).id.toString()
        );
        await Promise.allSettled([(req.task as any).deleteOne(), (req.board as any).save()]);
        res.send('Tarea Eliminada Correctamente');
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
};