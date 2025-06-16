import mongoose_task, { Schema as Schema_task, Document as Document_task, PopulatedDoc as PopulatedDoc_task, Types as Types_task } from 'mongoose';
import { IUser as IUser_task } from './User';
import { INote } from './Note';

export const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const;

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

export interface ITask extends Document_task {
    name: string;
    description: string;
    board: Types_task.ObjectId;
    status: TaskStatus;
    completedBy: {
        user: PopulatedDoc_task<IUser_task & Document_task>;
        status: TaskStatus;
    }[];
    notes: PopulatedDoc_task<INote & Document_task>[];
}

const TaskSchema: Schema_task = new Schema_task({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    board: { type: Schema_task.Types.ObjectId, ref: 'Board' },
    status: { type: String, enum: Object.values(taskStatus), default: taskStatus.PENDING },
    completedBy: [
        {
            user: { type: Schema_task.Types.ObjectId, ref: 'User' },
            status: { type: String, enum: Object.values(taskStatus), default: taskStatus.PENDING }
        }
    ],
    notes: [
        {
            type: Types_task.ObjectId,
            ref: 'Note'
        }
    ]
}, { timestamps: true });

const Task = mongoose_task.model<ITask>('Task', TaskSchema);
export default Task;