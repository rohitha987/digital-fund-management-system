import mongoose, { Schema, Document, CallbackError } from "mongoose";

export enum UserRole {
    ADMIN = 'admin',
    PARTICIPANT = 'participant',
    ORGANIZER = 'organizer'
}

export interface User extends Document {
    userId: string;
    userName: string;
    userEmail: string;
    password: string;
    userMobileNum: string;
    userAddress: string;
    userRole: UserRole;
    groupIds: string[];
}

// Counter schema for userId auto-increment
const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const userSchema: Schema = new Schema({
    userId: { type: String, unique: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    password: { type: String, required: true },
    userMobileNum: { type: String, required: true },
    userAddress: { type: String, required: true },
    userRole: { type: String, required: true, enum: Object.values(UserRole) },
    groupIds: { type: [String] },
});

// Middleware to auto-increment userId before saving a new user
userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isNew) {
        return next();
    }

    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: "userId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        user.userId = "user"+counter.seq;
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

export default mongoose.model<User>('User', userSchema);
