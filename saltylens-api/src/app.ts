import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Base route buat ngetes
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'SaltyLens API Core is running 🚀' });
});

export default app;