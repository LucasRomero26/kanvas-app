import mongoose, { Schema, Document, PopulatedDoc } from 'mongoose';
import { ITask } from './Task';
import { IUser } from './User';

export interface IBoard extends Document {
    name: string;
    description: string;
    owner: PopulatedDoc<IUser & Document>;
    tasks: PopulatedDoc<ITask & Document>[];
}

const BoardSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true // <-- ¡AÑADE ESTA LÍNEA!
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    ]
}, { timestamps: true });

const Board = mongoose.model<IBoard>('Board', BoardSchema);
export default Board;