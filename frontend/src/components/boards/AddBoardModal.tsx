import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createBoard } from '../../api/BoardAPI';
import type { BoardFormData } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';

type AddBoardModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddBoardModal({ open, onOpenChange }: AddBoardModalProps) {
    const form = useForm<BoardFormData>({
        defaultValues: { name: '', description: '' }
    });
    const queryClient = useQueryClient();
    
    const { mutate } = useMutation({
        mutationFn: createBoard,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            toast.success(data);
            onOpenChange(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const onSubmit = (data: BoardFormData) => {
        mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo Tablero</DialogTitle>
                    <DialogDescription>Crea un nuevo tablero para organizar tus proyectos.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Tablero</FormLabel>
                                <FormControl><Input placeholder="Ej: Proyecto Kanvas" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl><Textarea placeholder="Añade una descripción de tu proyecto" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" className="w-full">Crear Tablero</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}