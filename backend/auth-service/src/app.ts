import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use(cors())

connectDB();
export default app;
