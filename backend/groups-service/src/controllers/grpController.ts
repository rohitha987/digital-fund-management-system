import { Request,Response } from "express";
import Group from "../models/groups";

export const createGroup = async (req:Request,res:Response) => {
    const group = new Group(req.body);
    try{
        const newGroup = await group.save();
        res.status(201).json(newGroup);
    }catch(error){
        res.status(400).json({message:error});
    }
}

export const getAllGroups = async (req:Request, res:Response) => {
    try{
        const groups = await Group.find();
        res.status(200).json(groups);
    }catch(error){
        res.status(400).json({message:error});
    }
}

export const getByGroupName =async (req:Request,res:Response)=>{
    try{
        const group = await Group.findOne({groupName:req.params.groupName});
        res.status(200).json(group);
    }catch(error){
        res.status(400).json({message:error});
    }
}

export const updateGroup = async(req:Request,res:Response)=>{
    try{
        const group = await Group.findOneAndUpdate({groupName:req.params.groupName},req.body,{new:true});
        res.status(200).json(group);
    }catch(error){
        res.status(400).json({message:error});
    }
}

export const deleteGroup = async(req:Request,res:Response)=>{
    try{
        Group.deleteOne({groupName:req.params.groupName});
        res.status(200).json({message:"Deleted successfully"});
    }catch(error){
        res.status(400).json({message:error});
    }
} 