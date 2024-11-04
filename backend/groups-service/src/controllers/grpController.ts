import { Request,Response } from "express";
import Group from "../models/groups";
import axios from "axios";

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

export const getByGroupId =async (req:Request,res:Response)=>{
    try{
        const group = await Group.findOne({groupId:req.params.groupId});
        if(!group){
            return res.status(404).json({message:"Group not found"});
        }
        res.status(200).json(group);
    }catch(error){
        res.status(400).json({message:error});
    }
}

export const updateGroup = async(req:Request,res:Response)=>{
    try{
        const group = await Group.findOneAndUpdate({groupId:req.params.groupId},req.body,{new:true});
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

export const requestToJoinGroup = async (req: Request, res: Response) => {

    const { groupId ,userId } = req.body; // Assuming you send userId and groupId in the request body

    try {
        const group = await Group.findOne({ groupId });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if the user has already requested to join
        if (group.joinRequests.some(request => request === userId)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        // Add the request to the joinRequests array
        group.joinRequests.push(userId);
        await group.save();

        res.status(200).json({ message: "Join request sent successfully" });
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getAllRequests  = async (req: Request, res: Response) => {
    try {
        const group = await Group.findOne({ groupId: req.params.groupId });
        if(!group){
            return res.status(404).json({message:"Group not found"});
        }
        const requests = group.joinRequests;
        res.status(200).json(requests);
    }
    catch(error){
        res.status(400).json({message:error});
    }
}


export const addParticipant = async(req:Request, res:Response)=>{
    try{
        const group = await Group.findOne({groupId:req.params.groupId});
        if(!group){
            return res.status(404).json({message:"Group not found"});
        }
        console.log(req.params.userId);
        group.participants.push(req.params.userId);
        // Find the index of the request
        const requestIndex = group.joinRequests.findIndex(request => request === req.params.userId);
        if (requestIndex === -1) {
            return res.status(404).json({ message: "Join request not found" });
        }
        group.joinRequests.splice(requestIndex, 1);
        const updatedGroup = await group.save();
        res.status(200).json(updatedGroup);
    }catch(error){
        res.status(400).json({message:error});
    }
}

export const getParticipantsOfGroup = async (req: Request, res: Response) => {
    try {
        // Find the group by groupId
        const group = await Group.findOne({ groupId: req.params.groupId });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // If there are no participants, return an empty array
        if (group.participants.length === 0) {
            return res.status(200).json({ participants: [] });
        }

        // Fetch participant details for each participant ID
        const participantPromises = group.participants.map(async (userId) => {
            console.log(userId);
            const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data; // Assuming the user data is returned in the response
        });

        // Resolve all promises
        const participantsDetails = await Promise.all(participantPromises);
        
        res.status(200).json({ participants: participantsDetails });
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(400).json("Failed to fetch participants");
    }
}