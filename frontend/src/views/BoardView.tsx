import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBoardById, updateTaskStatus, deleteTask } from '../api/BoardAPI';
//
// --- 1. IMPORT THE NECESSARY SENSORS AND HOOKS ---
import { DndContext, DragOverlay, useSensor, useSensors, TouchSensor, MouseSensor, defaultDropAnimationSideEffects } from '@dnd-kit/core';import type { DragStartEvent, DragEndEvent, DropAnimation } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskList from '../components/tasks/TaskList';
import TaskCard from '../components/tasks/TaskCard';
import { taskStatusSchema } from '../types';
import type { Board, Task, TaskStatus } from '../types';
import { Button } from '../components/ui/button';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { toast } from 'sonner';
import { PlusCircle, ArrowLeft } from 'lucide-react';

const statusTranslations: Record<TaskStatus, string> = {
    pending: 'Pendiente',
    onHold: 'En Espera',
    inProgress: 'En Progreso',
    underReview: 'En Revisión',
    completed: 'Completado'
};

const statusColors: Record<TaskStatus, string> = {
    pending: 'border-t-slate-500 dark:border-t-slate-400',
    onHold: 'border-t-red-500 dark:border-t-red-400',
    inProgress: 'border-t-blue-500 dark:border-t-blue-400',
    underReview: 'border-t-amber-500 dark:border-t-amber-400',
    completed: 'border-t-emerald-500 dark:border-t-emerald-400'
};

const dropAnimationConfig: DropAnimation = {
    duration: 250,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.6'
            }
        },
    }),
};

export default function BoardView() {
    // ... (existing state and query hooks)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const params = useParams();
    const boardId = params.boardId!;
    const queryClient = useQueryClient();
    const [activeTask, setActiveTask] = useState<Task | null>(null);


    // --- 2. CONFIGURE THE SENSORS ---
    const mouseSensor = useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before starting a drag
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        // Press and hold for 250ms for touch devices
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });
    const sensors = useSensors(mouseSensor, touchSensor);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['board', boardId],
        queryFn: () => getBoardById(boardId),
        retry: false
    });

    // ... (existing mutation and handler functions)
    const updateTaskMutation = useMutation({
        mutationFn: updateTaskStatus,
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['board', boardId] });
            const previousBoardData = queryClient.getQueryData<Board & { tasks: Task[] }>(['board', boardId]);
            if (previousBoardData) {
                const updatedTasks = previousBoardData.tasks.map(task => {
                    if (task._id === variables.taskId) {
                        return { ...task, status: variables.status };
                    }
                    return task;
                });
                queryClient.setQueryData(['board', boardId], { ...previousBoardData, tasks: updatedTasks });
            }
            return { previousBoardData };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousBoardData) {
                queryClient.setQueryData(['board', boardId], context.previousBoardData);
            }
            toast.error("No se pudo mover la tarea");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['board', boardId] });
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['board', boardId] });
            toast.success(data);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = data?.tasks.find(t => t._id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;
        if (over) {
            const taskId = active.id.toString();
            let newStatus: TaskStatus | undefined;
            const isColumn = taskStatusSchema.options.includes(over.id as TaskStatus);
            if (isColumn) {
                newStatus = over.id as TaskStatus;
            } else {
                const overTask = data?.tasks.find(task => task._id === over.id);
                if (overTask) {
                    newStatus = overTask.status;
                }
            }
            const currentTask = data?.tasks.find(t => t._id === taskId);
            if (newStatus && currentTask && currentTask.status !== newStatus) {
                updateTaskMutation.mutate({ boardId, taskId, status: newStatus });
            }
        }
        setActiveTask(null);
    }

    const handleDragCancel = () => {
        setActiveTask(null);
    }

    const handleDeleteTask = (taskId: Task['_id']) => {
        deleteTaskMutation.mutate({ boardId, taskId });
    };


    if (isLoading) return <p className="text-center">Cargando...</p>;
    if (isError) return <p className="text-center">Error al cargar el tablero</p>;

    if (data) return (
        <>
            <div className="flex justify-between items-center mb-10">
                {/* --- Botón de regreso + título --- */}
                <div className="flex items-center gap-4">
                    <Link to="/" aria-label="Regresar al administrador de tableros">
                        <Button variant="ghost" className="flex items-center gap-2 text-sm font-medium">
                            <ArrowLeft className="h-4 w-4" />
                            <span></span>
                        </Button>
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
                        {data.name}
                    </h1>
                </div>

                {/* --- Botón “Añadir Tarea” existente --- */}
                <Button onClick={() => setIsTaskModalOpen(true)}>
                    <PlusCircle className="mr-2" />
                    Añadir Tarea
                </Button>
            </div>

            {/* --- 3. PASS THE SENSORS TO THE DNDCONTEXT --- */}
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <section className="flex flex-col lg:flex-row gap-6 items-start">
                    {Object.entries(statusTranslations).map(([statusKey, statusValue]) => (
                        <div key={statusKey} className="w-full lg:w-1/5">
                            <h3 className={`text-lg font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-gray-800 p-3 border-t-8 rounded-t-lg capitalize ${statusColors[statusKey as TaskStatus]}`}>
                                {statusValue}
                            </h3>
                            <div className="bg-slate-100 dark:bg-gray-800/40 p-3 space-y-4 rounded-b-lg flex-grow min-h-[100px]">
                                <SortableContext items={data.tasks.filter(t => t.status === statusKey).map(t => t._id)} strategy={verticalListSortingStrategy}>
                                    <TaskList
                                        tasks={data.tasks.filter(task => task.status === statusKey)}
                                        status={statusKey}
                                        onDelete={handleDeleteTask}
                                    />
                                </SortableContext>
                            </div>
                        </div>
                    ))}
                </section>

                <DragOverlay dropAnimation={dropAnimationConfig}>
                    {activeTask ? <TaskCard task={activeTask} onDelete={() => { }} /> : null}
                </DragOverlay>
            </DndContext>

            <AddTaskModal open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen} />
        </>
    );
}