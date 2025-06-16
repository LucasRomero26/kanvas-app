import mongoose, { Schema, Document, PopulatedDoc } from 'mongoose';
import { IBoard } from './Board';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    boards: PopulatedDoc<IBoard & Document>[];
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, trim: true },
    boards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Board'
        }
    ]
}, { timestamps: true });

const User = mongoose.model<IUser>('User', UserSchema);
export default User;