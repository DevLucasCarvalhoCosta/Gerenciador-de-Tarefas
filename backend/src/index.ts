import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authroutes';
import tarefaRoutes from './routes/tarefaRoutes'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tarefas', tarefaRoutes);


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
