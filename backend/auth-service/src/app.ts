import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

connectDB();
export default app;
