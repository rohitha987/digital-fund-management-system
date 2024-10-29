import express from 'express';
import routes from './routes/grpRoutes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/groups', routes);

export default app;