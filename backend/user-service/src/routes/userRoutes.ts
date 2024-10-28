import express from "express";
import { getAllUsers, getUserById, registerUser } from "../controllers/userController";

const router=express.Router();

router.post('/register', registerUser)

router.get('/all', getAllUsers)

router.get('/:userId', getUserById)



export default router;