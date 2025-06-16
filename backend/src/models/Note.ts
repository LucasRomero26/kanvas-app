import mongoose_note, { Schema as Schema_note, Document as Document_note, Types as Types_note } from 'mongoose';

export interface INote extends Document_note {
    content: string;
    createdBy: Types_note.ObjectId;
    task: Types_note.ObjectId;
}

const NoteSchema: Schema_note = new Schema_note({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema_note.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: Schema_note.Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, { timestamps: true });

const Note = mongoose_note.model<INote>('Note', NoteSchema);
export default Note;