import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoards, deleteBoard } from '../api/BoardAPI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import AddBoardModal from '../components/boards/AddBoardModal';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import type { Board } from '../types';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { MoreVertical, PlusCircle } from 'lucide-react'; // <- Importa el ícono
import EditBoardModal from '../components/boards/EditBoardModal';

export default function DashboardView() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [boardToEdit, setBoardToEdit] = useState<Board | null>(null);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['boards'],
        queryFn: getBoards
    });

    const { mutate } = useMutation({
        mutationFn: deleteBoard,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            toast.success(data);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const handleDelete = (boardId: Board['_id']) => {
        mutate(boardId);
    }

    const handleEdit = (board: Board) => {
        setBoardToEdit(board);
        setIsEditModalOpen(true);
    };

    if (isLoading) return 'Cargando...';

    if (data) return (
        <>
            <h1 className="text-3xl md:text-5xl font-black mb-10 text-slate-900 dark:text-white">Mis Proyectos</h1>
            
            {data.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map(board => (
                        <div key={board._id} className="relative group">
                             {/* CAMBIO: 'flex-col h-full' para asegurar la altura completa */}
                            <Link to={`/board/${board._id}`} className="block h-full">
                                <Card className="bg-white dark:bg-gray-800/50 hover:shadow-lg dark:hover:bg-gray-800 transition-all duration-300 ease-in-out h-full flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="text-slate-800 dark:text-slate-100">{board.name}</CardTitle>
                                        <CardDescription className="text-slate-500 dark:text-slate-400 line-clamp-3">{board.description}</CardDescription>
                                    </CardHeader>
                                    {/* CAMBIO: 'mt-auto' para empujar al fondo */}
                                    <CardContent className="mt-auto">
                                        <p className='text-sm text-slate-400 dark:text-slate-500'>
                                            Haz clic para ver las tareas
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                            {/* CAMBIO: 'opacity-0 group-hover:opacity-100' para mostrar en hover */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); }}>
                                            <MoreVertical className="text-slate-500 dark:text-slate-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-2 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700" onClick={e => { e.stopPropagation(); }}>
                                        <div className="flex flex-col gap-1">
                                            <Button variant="ghost" className="w-full justify-start hover:bg-slate-100 dark:hover:bg-gray-800" onClick={() => handleEdit(board)}>
                                                Editar Tablero
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-500">
                                                        Eliminar Tablero
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-white dark:bg-gray-900">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Se eliminará permanentemente el tablero y todas sus tareas.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(board._id)} className="bg-red-600 hover:bg-red-700">
                                                            Sí, Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    ))}
                    {/* CAMBIO: Botón con ícono para un look más moderno */}
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="text-center text-slate-500 dark:text-slate-400">
                            <PlusCircle className="mx-auto h-10 w-10 mb-2" />
                            <p>Crear Nuevo Tablero</p>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-gray-800">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">No tienes proyectos todavía.</p>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusCircle className="mr-2" />
                        Crear mi Primer Proyecto
                    </Button>
                </div>
            )}
            <AddBoardModal open={isModalOpen} onOpenChange={setIsModalOpen} />

            {boardToEdit && (
                <EditBoardModal 
                    board={boardToEdit} 
                    open={isEditModalOpen} 
                    onOpenChange={setIsEditModalOpen} 
                />
            )}
        </>
    );
}