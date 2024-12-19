import express from 'express';
import transactionRoutes from './routes/transactionRoutes';
import { connectDB } from './config/db';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3005',
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.options('*', cors());

app.use('/api/transactions', transactionRoutes);

connectDB();

export default app;