import mongoose, {Schema, Document} from "mongoose";

export enum UserRole{
    ADMIN = 'admin',
    PARTICIPANT = 'participant',
    ORGANIZER = 'organizer'
}

export interface User extends Document {
    userId: string;
    userName: string;
    userEmail: string;
    password:  string;
    userMobileNum: string;
    userAddress: string;
    userRole: UserRole;
    groupIds: string[];
}

const userSchema : Schema = new Schema({
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    userEmail: {type: String, required: true},
    password: {type: String, required: true},
    userMobileNum: {type: String, required: true},
    userAddress: {type: String, required: true},
    userRole: {type: String, required: true},
    groupsIds: [{type: String }],

});


export default mongoose.model<User>('User', userSchema);