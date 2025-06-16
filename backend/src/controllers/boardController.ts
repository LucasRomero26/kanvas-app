import { Request, Response } from 'express';
import Board from '../models/Board';

export const createBoard = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Operación no válida' });
        return;
    }
    try {
        const board = new Board(req.body);
        board.owner = req.user.id;
        
        req.user.boards.push(board.id);
        await Promise.allSettled([board.save(), req.user.save()]);

        res.status(201).send('Tablero Creado Correctamente');
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al crear el tablero' });
    }
};

export const getAllBoards = async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Operación no válida' });
        return;
    }
    try {
        const boards = await Board.find({ owner: req.user.id });
        res.json(boards);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
};

export const getBoardById = async (req: Request, res: Response) => {
    if (!req.board) {
        res.status(404).json({ error: 'Tablero No Encontrado' });
        return;
    }
    try {
        res.json(req.board);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
};

export const updateBoardById = async (req: Request, res: Response) => {
    if (!req.board) {
        res.status(404).json({ error: 'Tablero no encontrado' });
        return;
    }
    try {
        req.board.name = req.body.name || req.board.name;
        req.board.description = req.body.description || req.board.description;
        
        await req.board.save();
        res.send('Tablero actualizado correctamente');
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al actualizar el tablero' });
    }
};

export const deleteBoardById = async (req: Request, res: Response) => {
    if (!req.board) {
        res.status(404).json({ error: 'Tablero no encontrado' });
        return;
    }
    try {
        await req.board.deleteOne();
        res.send('Tablero eliminado correctamente');
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al eliminar el tablero' });
    }
};