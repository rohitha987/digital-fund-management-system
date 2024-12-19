import { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const USER_SERVICE_URL = `http://localhost:3002/api/users/register`;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use your own secret

export const register: RequestHandler = async (req: Request, res: Response) => {
    const { userId, userName, userEmail, password, userMobileNum, userAddress, userRole } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            userId,
            userName,
            userEmail,
            password: hashedPassword,
            userMobileNum,
            userAddress,
            userRole,
        };

        const response = await axios.post(USER_SERVICE_URL, userData);
        if (response.status === 201) {
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            res.status(response.status).json({ message: response.data.message });
        }
    } catch (error: unknown) {
        // Use type assertion to access properties
        if (axios.isAxiosError(error)) {
            console.error('Error during registration:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({ message: error.response?.data?.message || 'Error registering user' });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'Error registering user', error: 'Internal Server Error' });
        }
    }
};

// Login function that generates a token
export const login: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { userEmail, password } = req.body;

        console.log(`Attempting to fetch user with email: ${userEmail}`);

        // Fetch user data from user-service
        const response = await axios.get(`http://localhost:3002/api/users/email/${userEmail}`);

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
