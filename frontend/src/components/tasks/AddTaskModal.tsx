import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTask } from '../../api/BoardAPI';
import type { TaskFormData } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { useParams } from 'react-router-dom';

type AddTaskModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddTaskModal({ open, onOpenChange }: AddTaskModalProps) {
    const params = useParams();
    const boardId = params.boardId!;
    const form = useForm<TaskFormData>({
        defaultValues: { name: '', description: '' }
    });
    
    // CORRECCIÓN: Obtenemos el cliente de React Query
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: createTask,
        onSuccess: (data) => {
            // CORRECCIÓN: Invalidamos la caché del tablero para forzar una actualización
            queryClient.invalidateQueries({ queryKey: ['board', boardId] });
            toast.success(data);
            onOpenChange(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const onSubmit = (data: TaskFormData) => {
        mutate({ boardId, formData: data });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nueva Tarea</DialogTitle>
                    <DialogDescription>Añade una nueva tarea a tu proyecto.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de la Tarea</FormLabel>
                                <FormControl><Input placeholder="Ej: Implementar login" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl><Textarea placeholder="Añade una descripción de la tarea" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" className="w-full">Crear Tarea</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
