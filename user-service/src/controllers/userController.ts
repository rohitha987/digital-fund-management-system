import { Request, Response } from 'express';
import UserService from '../services/userService';

const userService = new UserService();

export const registerUser = async (req: Request, res: Response) => {
    try {
      const user = await userService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).json({ message: errorMessage });
    }
  };

  export const getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ message: errorMessage });
    }
  };
  
  export const getUserById = async (req: Request, res: Response) => {
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
  