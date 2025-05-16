import { RequestHandler } from 'express';
import { db } from '../config/db';

const criar: RequestHandler = async (req, res) => {
  const { titulo, descricao } = req.body;
  const usuarioId = (req as any).usuario.id;

  try {
    await db.query(
      'INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES (?, ?, ?)',
      [titulo, descricao, usuarioId]
    );
    res.status(201).json({ message: 'Tarefa criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
};

const listar: RequestHandler = async (req, res) => {
  const usuarioId = (req as any).usuario.id;

  try {
    const [tarefas] = await db.query('SELECT * FROM tarefas WHERE usuario_id = ?', [usuarioId]);
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
    const [result] = await db.query(
      'UPDATE tarefas SET titulo = ?, descricao = ?, status = ? WHERE id = ? AND usuario_id = ?',
      [titulo, descricao, status, id, usuarioId]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: 'Tarefa não encontrada ou sem permissão.' });
      return;
    }

    res.json({ message: 'Tarefa atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
};

const deletar: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const usuarioId = (req as any).usuario.id;

  try {
    const [result] = await db.query(
      'DELETE FROM tarefas WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: 'Tarefa não encontrada ou sem permissão.' });
      return;
    }

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
