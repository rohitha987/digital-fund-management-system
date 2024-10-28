import express from 'express';
import userRoutes from './routes/userRoutes';
import { connectDB } from './config/db';

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

connectDB();

export default app;