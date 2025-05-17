import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import { prisma } from '../prisma/client';

const criar: RequestHandler = async (req, res) => {
  const { titulo, descricao, prioridade } = req.body;
  const usuarioId = (req as any).usuario.id;

  try {
    const tarefa = await prisma.tarefa.create({
      data: {
        titulo,
        descricao,
        status: 'pendente', // forçando pendente
        prioridade: prioridade || 'baixa',
        usuarioId,
      },
    });

    res.status(201).json(tarefa);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};


const listar: RequestHandler = async (req, res) => {
  const usuarioId = (req as any).usuario.id;

  try {
    const tarefas = await prisma.tarefa.findMany({
      where: { usuarioId },
      orderBy: {
        id: 'desc',
      },
    });

    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar tarefas.' });
  }
};


const atualizar = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { titulo, descricao, status, prioridade } = req.body;
  const usuarioId = (req as any).usuario.id;

  const statusPermitidos = ['pendente', 'em_andamento', 'concluida'];
  const prioridadePermitidas = ['baixa', 'media', 'alta'];

  try {
    const tarefa = await prisma.tarefa.findFirst({
      where: { id: Number(id), usuarioId },
    });

    if (!tarefa) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou sem permissão.' });
    }

    if (status && !statusPermitidos.includes(status)) {
      return res.status(400).json({ message: 'Status inválido.' });
    }
    if (prioridade && !prioridadePermitidas.includes(prioridade)) {
      return res.status(400).json({ message: 'Prioridade inválida.' });
    }

    const dataToUpdate: any = {};
    if (titulo !== undefined) dataToUpdate.titulo = titulo;
    if (descricao !== undefined) dataToUpdate.descricao = descricao;
    if (status !== undefined) dataToUpdate.status = status;
    if (prioridade !== undefined) dataToUpdate.prioridade = prioridade;

    const tarefaAtualizada = await prisma.tarefa.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return res.json(tarefaAtualizada);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
};


const deletar: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const usuarioId = (req as any).usuario.id;

  try {
    const tarefa = await prisma.tarefa.findFirst({
      where: { id: Number(id), usuarioId }
    });

    if (!tarefa) {
      res.status(404).json({ message: 'Tarefa não encontrada ou sem permissão.' });
      return;
    }

    await prisma.tarefa.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar tarefa.' });
  }
};

export default {
  criar,
  listar,
  atualizar,
  deletar
};
