import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import tarefaRoutes from './routes/tarefa.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tarefas', tarefaRoutes);

app.use(errorMiddleware);
export default app;
