import express from 'express';
import transactionRoutes from './routes/transactionRoutes';
import { connectDB } from './config/db';

const app = express();
app.use(express.json());

app.use('/api/transactions', transactionRoutes);

connectDB();

export default app;