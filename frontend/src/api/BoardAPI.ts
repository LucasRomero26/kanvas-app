import api from "./config";
import type { Board, BoardFormData, Task, TaskFormData, TaskStatus } from "../types";

export async function createBoard(formData: BoardFormData) {
    try {
        const { data } = await api.post('/boards', formData);
        return data;
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al crear el tablero');
    }
}

export async function getBoards() {
    try {
        const { data } = await api.get<Board[]>('/boards');
        return data;
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al obtener los tableros');
    }
}

export async function getBoardById(id: Board['_id']) {
    try {
        const { data } = await api.get<Board & { tasks: Task[] }>(`/boards/${id}`);
        return data;
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al obtener el tablero');
    }
}

// --- Tareas ---
type CreateTaskParams = {
    boardId: Board['_id'];
    formData: TaskFormData;
}
export async function createTask({ boardId, formData }: CreateTaskParams) {
    try {
        const { data } = await api.post(`/boards/${boardId}/tasks`, formData);
        return data;
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al crear la tarea');
    }
}

type UpdateTaskStatusParams = {
    boardId: Board['_id'];
    taskId: Task['_id'];
    status: TaskStatus;
}
export async function updateTaskStatus({ boardId, taskId, status }: UpdateTaskStatusParams) {
    try {
        const { data } = await api.patch(`/boards/${boardId}/tasks/${taskId}/status`, { status });
        return data;
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al actualizar la tarea');
    }
}

type DeleteTaskParams = {
    boardId: Board['_id'];
    taskId: Task['_id'];
}
export async function deleteTask({ boardId, taskId }: DeleteTaskParams) {
    try {
        const { data } = await api.delete(`/boards/${boardId}/tasks/${taskId}`);
        return data;
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al eliminar la tarea');
    }
}

// --- NUEVA FUNCIÓN PARA ACTUALIZAR TABLEROS ---
type UpdateBoardParams = {
    boardId: Board['_id'];
    formData: BoardFormData;
}
export async function updateBoard({ boardId, formData }: UpdateBoardParams) {
    try {
        const { data } = await api.put<string>(`/boards/${boardId}`, formData);
        return data;
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al actualizar el tablero');
    }
}


// --- NUEVA FUNCIÓN PARA ELIMINAR TABLEROS ---
export async function deleteBoard(id: Board['_id']) {
    try {
        const { data } = await api.delete(`/boards/${id}`);
        return data;
    } catch (error: any) {
        throw new Error(error.response.data.error || 'Error al eliminar el tablero');
    }
}