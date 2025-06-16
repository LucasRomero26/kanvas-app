import { z } from 'zod';

// --- AUTENTICACIÓN Y USUARIO ---
export const userSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
});
export type User = z.infer<typeof userSchema>;

// --- TABLEROS (BOARDS) ---
export const boardSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
});
export type Board = z.infer<typeof boardSchema>;
export type BoardFormData = Pick<Board, 'name' | 'description'>;

// --- TAREAS (TASKS) ---
export const taskStatusSchema = z.enum([
    "pending",
    "onHold",
    "inProgress",
    "underReview",
    "completed",
]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    board: z.string(),
    status: taskStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});
export type Task = z.infer<typeof taskSchema>;
export type TaskFormData = Pick<Task, 'name' | 'description'>;
