import mongoose,{Schema,Document} from "mongoose";

interface IGroup extends Document{
    groupId:string;
    groupName:string;
    groupType:string;
    interest: number;
    organizerId:string;
    members:number;
    duration:number;
    totalAmount:number;
    ticketValue:number;
    participants:string[];
    description:string;
    createdAt:Date;
    updatedAt:Date;
}

const groupSchema:Schema<IGroup> = new Schema({
    groupId:{type:String,required:true,unique:true},
    groupName:{type:String,required:true,unique:true},
    groupType:{type:String,required:true},
    interest:{type:Number,required:true},
    organizerId:{type:String,required:true},
    members:{type:Number,required:true},
    duration:{type:Number,required:true},
    totalAmount:{type:Number,required:true},
    ticketValue:{type:Number,required:true},
    participants:{type:[String]},
    description:{type:String,required:true}
},{
    collection:"groups",
    versionKey:false,
    timestamps:true
})

const Group = mongoose.model<IGroup>("Group",groupSchema);

export default Group;