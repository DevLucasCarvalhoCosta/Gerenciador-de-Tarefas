import { RequestHandler } from 'express';
import { prisma } from '../prisma/client';

const criar: RequestHandler = async (req, res) => {
  const { titulo, descricao } = req.body;
  const usuarioId = (req as any).usuario.id;

  try {
    await prisma.tarefa.create({
      data: {
        titulo,
        descricao,
        usuarioId
      }
    });

    res.status(201).json({ message: 'Tarefa criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

const listar: RequestHandler = async (req, res) => {
  const usuarioId = (req as any).usuario.id;

  try {
    const tarefas = await prisma.tarefa.findMany({
      where: { usuarioId }
    });

    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar tarefas.' });
  }
};

const atualizar: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, status } = req.body;
  const usuarioId = (req as any).usuario.id;

  try {
    const tarefa = await prisma.tarefa.findFirst({
      where: { id: Number(id), usuarioId }
    });

    if (!tarefa) {
      res.status(404).json({ message: 'Tarefa não encontrada ou sem permissão.' });
      return;
    }

    await prisma.tarefa.update({
      where: { id: Number(id) },
      data: { titulo, descricao, status }
    });

    res.json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
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
