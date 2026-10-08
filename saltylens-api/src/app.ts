import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import widgetRoutes from './routes/widgetRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/widgets', widgetRoutes);
app.use('/api/analytics', analyticsRoutes);


app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'SaltyLens API Core is running' });
});

export default app;