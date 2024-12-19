import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { UserRole } from '../models/User';

interface AuthRequest extends Request {
    user?: { userId: string; role: UserRole };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    try {
        const decoded = verifyToken(token);
        req.user = decoded as { userId: string; role: UserRole };
        next();
    } catch {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export const authorizeRole = (roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
