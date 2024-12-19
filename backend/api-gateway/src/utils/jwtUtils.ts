import jwt from 'jsonwebtoken';
 
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
 
export const verifyToken = (token: string) => {
    try {
        console.log('Verifying token:', token);
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token verification failed');
    }
};