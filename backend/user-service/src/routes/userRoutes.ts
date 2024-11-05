import express from "express";
import { getAllUsers, getUserByEmail, getUserById, registerUser,getListOfGroups, editUserProfile, respondToJoinRequest, addGroups, getIdByUserName } from "../controllers/userController";

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for getting all users
router.get('/all', getAllUsers);

// Route for getting a user by their ID
router.get('/:userId', getUserById);

// Route for getting a user by their email
router.get('/email/:userEmail', getUserByEmail); // Change the route to avoid conflicts

router.get('/name/:userName', getIdByUserName); // Change the route to avoid

router.get('/groups/:userEmail',getListOfGroups);

router.put('/editprofile/:userEmail', editUserProfile);

router.post('/:groupId/join-request/:userId',respondToJoinRequest);

router.patch('/addGroup/:userEmail',addGroups);

export default router;
