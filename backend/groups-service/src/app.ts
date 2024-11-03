import express from 'express';
import routes from './routes/grpRoutes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3005',
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.options('*', cors());

app.use('/api/groups', routes);

export default app;