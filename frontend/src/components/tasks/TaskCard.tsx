import type { Task } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskCardProps = {
    task: Task;
    onDelete: (taskId: Task['_id']) => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task._id,
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        // --- CAMBIO AQUÍ ---
        // Añadimos la clase "list-none" para eliminar el punto negro
        <li ref={setNodeRef} style={style} className="list-none">
            <Card className="relative">
                <div className="absolute top-1 right-1">
                    <Button variant="ghost" size="icon" onClick={() => onDelete(task._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>
                    </Button>
                </div>

                <div {...attributes} {...listeners} className="cursor-grab">
                    <CardHeader>
                        <CardTitle>{task.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{task.description}</p>
                    </CardContent>
                </div>
            </Card>
        </li>
    )
}