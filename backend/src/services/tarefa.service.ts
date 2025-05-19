import { prisma } from '../../prisma/client';
import { PrioridadeTarefa, StatusTarefa } from '@prisma/client';

export class TarefaService {
  static async criar(
    usuarioId: number,
    titulo: string,
    descricao: string,
    prioridade: PrioridadeTarefa
  ) {
    return prisma.tarefa.create({
      data: {
        usuarioId,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        prioridade,
        status: 'pendente'
      }
    });
  }

  static async listar(usuarioId: number) {
    return prisma.tarefa.findMany({
      where: { usuarioId },
      orderBy: [
        { prioridade: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  static async atualizar(
    usuarioId: number,
    id: number,
    dados: Partial<{ titulo: string; descricao: string; status: StatusTarefa; prioridade: PrioridadeTarefa }>
  ) {
    const tarefa = await prisma.tarefa.findFirst({ where: { id, usuarioId } });
    if (!tarefa) throw { status: 404, message: 'Tarefa não encontrada.' };
    return prisma.tarefa.update({ where: { id }, data: dados });
  }

  static async deletar(usuarioId: number, id: number) {
    const tarefa = await prisma.tarefa.findFirst({ where: { id, usuarioId } });
    if (!tarefa) throw { status: 404, message: 'Tarefa não encontrada.' };
    await prisma.tarefa.delete({ where: { id } });
    return;
  }
}