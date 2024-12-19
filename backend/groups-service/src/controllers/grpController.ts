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
            const response = await axios.get(`http://localhost:3002/api/users/${userId}`, {
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

export const calculateChit = (req: Request, res: Response) => {
    const { totalAmount, months, members, commission } = req.body;

    // Validate inputs
    if (!totalAmount || !months || !members || totalAmount <= 0 || months <= 0 || members <= 0) {
        return res.status(400).json({ message: "Please enter valid values for all fields." });
    }

    const results: Array<any> = [];
    const Amount = totalAmount / members; // Amount paid monthly
    let interest = months / 200;
    let minAmount = totalAmount * (1 - interest); // Minimum bound (first person gets 70% of total)
    interest = 0;

    for (let month = 1; month <= months; month++) {
        interest += minAmount;
        const commissionAmount = (minAmount * commission) / 100;
        const amountGiven = minAmount - commissionAmount;

        results.push({
            month: month,
            amount: minAmount.toFixed(2),
            commission: commissionAmount.toFixed(2),
            amountGiven: amountGiven.toFixed(2),
        });

        minAmount += 0.01 * totalAmount; // Update minAmount for the next month
    }

    const totalProfit = totalAmount * months - interest;
    return res.status(200).json({ results, totalProfit });
};

export const getOrganizerOfGroup = async (req: Request, res: Response) => {
    try {
        const group = await Group.findOne({ groupId: req.params.groupId }).select('organizerId');
        console.log(group); // Select only the organizer field
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Helper function to calculate chit details
const calculateChitDetails = (totalAmount: number, months: number, members: number, commission: number) => {
    const results: Array<any> = [];
    const Amount = totalAmount / members;
    let interest = months / 200;
    let minAmount = totalAmount * (1 - interest);
    interest = 0;

    for (let month = 1; month <= months; month++) {
        interest += minAmount;
        const commissionAmount = (minAmount * commission) / 100;
        const amountGiven = minAmount - commissionAmount;

        results.push({
            month: month,
            amount: minAmount.toFixed(2),
            commission: commissionAmount.toFixed(2),
            amountGiven: amountGiven.toFixed(2),
        });

        minAmount += 0.01 * totalAmount;
    }

    const totalProfit = totalAmount * months - interest;
    return { results, totalProfit };
};

export const displayMonthlyPlan = async (req: Request, res: Response) => {
    const { groupId } = req.params; // Assuming groupId is passed as a URL parameter
    const { createdAt, totalAmount, duration, interest } = req.body;
    const months = duration;

    if (!groupId || !createdAt || !totalAmount || months <= 0 || totalAmount <= 0) {
        return res.status(400).json({ message: "Please provide valid values for groupId, createdAt, totalAmount, and months." });
    }

    try {
        // Calculate monthly plan details using a helper function
        const { results } = calculateChitDetails(totalAmount, months, months, interest);

        // Fetch participants from group-service
        const participantsResponse = await axios.get(`http://localhost:3003/api/groups/${groupId}/participants`);
        const participants = participantsResponse.data.participants;
        const userNames = participants.map((participant: any) => participant.userName);

        // Shuffle usernames randomly
        const shuffledUserNames = userNames.sort(() => Math.random() - 0.5);

        // Create an array of userNames corresponding to each month
        const monthlyDraw = [];
        for (let i = 0; i < results.length; i++) {
            monthlyDraw.push(shuffledUserNames[i % shuffledUserNames.length]); // Assign users to each month
        }

        console.log(monthlyDraw);

        console.log(groupId);

        // Update the group with the monthlyDraw array
        const updatedGroup = await Group.findOneAndUpdate(
            { groupId }, // Find the group by its ID
            { monthlyDraw },   // Update the monthlyDraw field with userNames
            { new: true }      // Return the updated document
        );

        return res.status(200).json({ results, monthlyDraw });
    } catch (error) {
        console.error("Error fetching participants or updating group:", error);
        return res.status(500).json({ message: "An error occurred while processing the request." });
    }
};






// Example route
