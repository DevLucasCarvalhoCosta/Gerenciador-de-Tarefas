import express from 'express';
import TarefaController from '../controllers/TarefaController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware); 

router.post('/', TarefaController.criar);
router.get('/', TarefaController.listar);
router.put('/:id', TarefaController.atualizar);
router.delete('/:id', TarefaController.deletar);

export default router;
