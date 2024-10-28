import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User'; // Assuming User model is shared or replicated in authentication-service
import dotenv from 'dotenv';

dotenv.config();

class AuthService {
  generateToken(userId: string, role: string) {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }

  verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }

  async login(userEmail: string, password: string) {
    const user = await User.findOne({ userEmail });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    return this.generateToken(user.userId, user.userRole);
  }
}

export default new AuthService();
