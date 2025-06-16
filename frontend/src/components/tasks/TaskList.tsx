import type { Task } from "../../types";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

type TaskListProps = {
    tasks: Task[];
    status: string;
    onDelete: (taskId: Task['_id']) => void; // <-- Acepta la nueva prop
}

export default function TaskList({ tasks, status, onDelete }: TaskListProps) {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    return (
        <ul ref={setNodeRef} className="space-y-5 flex-grow">
            {tasks.length === 0 ? (
                <li className="text-center text-gray-500 pt-5">No hay tareas aquí</li>
            ) : (
                tasks.map(task => (
                    <TaskCard 
                        key={task._id} 
                        task={task} 
                        onDelete={onDelete} // <-- Pasa la función a cada tarjeta
                    />
                ))
            )}
        </ul>
    )
}