import { Request, Response, NextFunction } from 'express';
 
import { UserRole } from '../models/User';
import { verifyToken } from '../utils/jwtUtils';
 
 
 
interface AuthRequest extends Request {
 
 user?: { userId: string; userRole: UserRole };
 
}
 
 
 
// Middleware to authenticate JWT and set req.user
 
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
 
 const token = req.headers.authorization?.split(' ')[1];
 
 if (!token) {
 
   res.status(403).json({ message: 'No token provided' });
 
   return;
 
 }
 
 try {
 
   const decoded = verifyToken(token);
   req.user = decoded as { userId: string; userRole: UserRole };
 
   next();
 
 } catch (error) {
 
   res.status(401).json({ message: 'Unauthorized' });
 
 }
 
};
 
 
 
// Middleware to authorize based on user roles
 
// export const authorizeRole = (roles: UserRole[]) => {
 
// return (req: AuthRequest, res: Response, next: NextFunction): void => {
 
// const userRole = req.user;
 
// console.log(userRole);
 
// if (!req.user || !roles.includes(req.user.role)) {
 
// res.status(403).json({ message: 'Forbidden' });
 
// return;
 
// }
 
// next();
 
// };
 
// };
 
 
 
// Middleware for role authorization
 
export const authorizeRole = (roles: UserRole[]) => {
 
 return (req: AuthRequest, res: Response, next: NextFunction): void => {
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
 
     res.status(403).json({ message: 'No token provided' });
 
     return;
 
   }
   const decoded = verifyToken(token);
   req.user = decoded as { userId: string; userRole: UserRole };
   console.log(req.user.userRole);
   if (!req.user || !req.user.userRole || !roles.includes(req.user.userRole)) {
 
     res.status(403).json({ message: 'Forbidden' });
 
     return;
 
   }
 
   next();
 
 };
 
};