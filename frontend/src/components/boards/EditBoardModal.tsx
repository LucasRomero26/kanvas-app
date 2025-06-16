import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateBoard } from '../../api/BoardAPI';
import type { Board, BoardFormData } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';

type EditBoardModalProps = {
    board: Board;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditBoardModal({ board, open, onOpenChange }: EditBoardModalProps) {
    const form = useForm<BoardFormData>({
        defaultValues: { name: board.name, description: board.description }
    });
    const queryClient = useQueryClient();
    
    const { mutate } = useMutation({
        mutationFn: updateBoard,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            queryClient.invalidateQueries({ queryKey: ['board', board._id] });
            toast.success(data);
            onOpenChange(false);
            form.reset();
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const onSubmit = (formData: BoardFormData) => {
        mutate({ boardId: board._id, formData });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Tablero</DialogTitle>
                    <DialogDescription>Modifica los datos de tu tablero.</DialogDescription>
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
                        <Button type="submit" className="w-full">Guardar Cambios</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}