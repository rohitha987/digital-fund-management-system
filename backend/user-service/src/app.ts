import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import { connectDB } from './config/db';

const app = express();

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3005',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Handle preflight requests
app.options('*', cors());

// Routes
app.use('/api/users', userRoutes);

// Connect to database
connectDB();

export default app;
