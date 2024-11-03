import { Request, Response, RequestHandler } from 'express';
import UserService from '../services/userService';
import User from '../models/User';

const userService = new UserService();

export const registerUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const user = await userService.register(req.body);
        console.log(user);
        res.status(201).json(user);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: errorMessage });
    }
};

export const getAllUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const getUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(req.params.userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};


/*export const getUserByEmail =async (req:Request,res:Response)=>{
  try{
      const user = await User.findOne({userEmail:req.params.userEmail});
      res.status(200).json(user);
  }catch(error){
      res.status(400).json({message:error});
  }
}*/

export const getUserByEmail: RequestHandler = async (req: Request, res: Response) => {
  try {
      const user = await userService.getUserByEmail(req.params.userEmail);
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ message: errorMessage });
  }
};

export const getListOfGroups = async(req:Request, res:Response)=>{
  try{
      const groups= await userService.getListofGroups(req.params.userEmail);
      if(!groups){
        res.status(404).json({message:"Group not found"});
      }
      console.log(groups);
      res.status(200).json(groups);
  }catch(error){
      res.status(400).json({message:error});
  }
}

export const editUserProfile: RequestHandler = async (req: Request, res: Response) => {
    try {
        const userEmail = req.params.userEmail; // Get userId from the URL parameters
        const userData = req.body; // Get updated user data from the request body
        
        // Update the user using the userService
        const updatedUser = await userService.editUserProfile(userEmail, userData);
        console.log(updatedUser);
        // Return the updated user data
        res.status(200).json(updatedUser);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: errorMessage });
    }
};

export const addGroups = async (req: Request, res: Response) => {
    const {userEmail} = req.params;
    const {groupId} = req.body;
    try {
      // console.log(groupId,userId,action);
      const user = await userService.addGroup(groupId,userEmail);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  };