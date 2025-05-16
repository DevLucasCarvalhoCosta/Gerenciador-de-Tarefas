import express from 'express';
import TarefaController from '../controllers/TarefaController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();


router.post('/', TarefaController.criar);
router.get('/', authMiddleware, TarefaController.listar);
router.put('/:id', TarefaController.atualizar);
router.delete('/:id', TarefaController.deletar);

export default router;
