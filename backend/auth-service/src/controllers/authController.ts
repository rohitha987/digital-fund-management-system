import { Request, Response, NextFunction, RequestHandler } from 'express';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

const USER_SERVICE_URL = 'http://localhost:3000/api/users/register';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use your own secret

// Register function without token generation
export const register: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { userId, userName, userEmail, password, userMobileNum, userAddress, userRole } = req.body;

        // Hash the password before sending to the user-service
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user data to send to user-service
        const userData = {
            userId,
            userName,
            userEmail,
            password: hashedPassword,
            userMobileNum,
            userAddress,
            userRole,
        };

        // Send a POST request to user-service to register the new user
        const response = await axios.post(USER_SERVICE_URL, userData);

        if (response.status === 201) {
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            res.status(response.status).json({ message: response.data.message });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login function that generates a token
export const login: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { userEmail, password } = req.body;

        console.log(`Attempting to fetch user with email: ${userEmail}`);

        // Fetch user data from user-service
        const response = await axios.get(`http://localhost:3000/api/users/email/${userEmail}`);

        if (response.status === 200) {
            const user = response.data;

            // Compare the provided password with the stored hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                // Generate a JWT token
                const token = jwt.sign({ userId: user.userId, userEmail, userRole: user.userRole }, JWT_SECRET, { expiresIn: '1h' });

                res.status(200).json({ message: 'Login successful', token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(response.status).json({ message: response.data.message });
        }
    } catch (error: any) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};
