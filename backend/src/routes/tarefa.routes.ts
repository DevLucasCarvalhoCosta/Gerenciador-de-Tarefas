import { Router } from 'express';
import { TarefaController } from '../controllers/tarefa.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { check } from 'express-validator';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
router.use(authMiddleware);

router.post('/',
  [
    check('titulo').notEmpty().withMessage('Título obrigatório'),
    check('descricao').notEmpty().withMessage('Descrição obrigatória'),
    check('prioridade').isIn(['baixa','media','alta']).withMessage('Prioridade inválida'),
    validationMiddleware
  ],
  TarefaController.criar
);
router.get('/', TarefaController.listar);
router.put('/:id',
  [
    check('status').optional().isIn(['pendente','em_andamento','concluida']).withMessage('Status inválido'),
    check('prioridade').optional().isIn(['baixa','media','alta']).withMessage('Prioridade inválida'),
    validationMiddleware
  ],
  TarefaController.atualizar
);
router.delete('/:id', TarefaController.deletar);
export default router;