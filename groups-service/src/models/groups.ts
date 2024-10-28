import { Double, UUID } from "mongodb";
import mongoose,{Schema,Document} from "mongoose";

interface IGroup extends Document{
    groupId:string;
    groupName:string;
    groupType:string;
    interest: number;
    organizerId:UUID;
    members:number;
    duration:number;
    totalAmount:number;
    ticketValue:number;
    participants:UUID[];
    description:string;
    createdAt:Date;
    updatedAt:Date;
}

const groupSchema:Schema<IGroup> = new Schema({
    groupId:{type:String,required:true,unique:true},
    groupName:{type:String,required:true,unique:true},
    groupType:{type:String,required:true},
    interest:{type:Number,required:true},
    organizerId:{type:UUID,required:true},
    members:{type:Number,required:true},
    duration:{type:Number,required:true},
    totalAmount:{type:Number,required:true},
    ticketValue:{type:Number,required:true},
    participants:{type:[UUID],required:true,unique:true},
    description:{type:String,required:true},
    createdAt:{type:Date,required:true,default:Date.now()},
    updatedAt:{type:Date,required:true,default:Date.now()},
},{
    collection:"groups",
    versionKey:false
})

const Group = mongoose.model<IGroup>("Group",groupSchema);

export default Group;