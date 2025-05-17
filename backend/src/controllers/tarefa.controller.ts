import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { TarefaService } from '../services/tarefa.service';

export class TarefaController {
  static criar = asyncHandler(async (req: Request, res: Response) => {
    const { titulo, descricao, prioridade } = req.body;
    const usuarioId = req.user!.id;
    const tarefa = await TarefaService.criar(usuarioId, titulo, descricao, prioridade);
    res.status(201).json(tarefa);
  });

  static listar = asyncHandler(async (req: Request, res: Response) => {
    const usuarioId = req.user!.id;
    const tarefas = await TarefaService.listar(usuarioId);
    res.json(tarefas);
  });

  static atualizar = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuarioId = req.user!.id;
    const dados = req.body;
    const updated = await TarefaService.atualizar(usuarioId, id, dados);
    res.json(updated);
  });

  static deletar = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuarioId = req.user!.id;
    await TarefaService.deletar(usuarioId, id);
    res.json({ message: 'Tarefa deletada com sucesso.' });
  });
}
