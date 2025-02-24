import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.json());

// Middleware
app.use(cors({
    origin: 'http://localhost:4200', // URL of your frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware

// Middleware
app.use(cors({
    origin: 'http://localhost:4200', // URL of your frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB

// Routes
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB

// Routes
app.use('/api/auth', authRoutes);
app.use(cors())

// Preflight request handler
app.options('*', cors());

// Basic error handling
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Server start

export default app;
