import request from 'supertest';
import app from '../src/app';
import { prisma } from '../prisma/client';

jest.setTimeout(20000);

describe('Tarefas - CRUD com autenticação', () => {
  const user = {
    nome: 'Usuário Tarefa',
    email: `tarefa_${Date.now()}@mail.com`,
    senha: '123456',
  };

  let token: string;
  let tarefaId: number;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/login').send({
      email: user.email,
      senha: user.senha,
    });
    token = res.body.token;
  });

  it('deve recusar acesso às tarefas sem token', async () => {
    const res = await request(app).get('/api/tarefas');
    expect(res.statusCode).toBe(401);
  });

  it('deve listar tarefas com token válido', async () => {
    const res = await request(app)
      .get('/api/tarefas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve criar uma nova tarefa', async () => {
    const newTask = {
      titulo: 'Tarefa de Teste',
      descricao: 'Criada pelo Jest',
      prioridade: 'baixa'    // ← adicionado para atender ao service
    };
    const res = await request(app)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send(newTask);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.titulo).toBe(newTask.titulo);
    expect(res.body.descricao).toBe(newTask.descricao);
    expect(res.body.status).toBe('pendente');
    expect(res.body.prioridade).toBe(newTask.prioridade);
  });

  it('deve obter o ID da tarefa criada', async () => {
    const res = await request(app)
      .get('/api/tarefas')
      .set('Authorization', `Bearer ${token}`);

    const tarefa = res.body.find((t: any) => t.titulo === 'Tarefa de Teste');
    expect(tarefa).toBeDefined();
    tarefaId = tarefa.id;
  });

  it('deve atualizar a tarefa', async () => {
    const updatedData = {
      titulo: 'Tarefa Atualizada',
      descricao: 'Descrição alterada via Jest',
      status: 'concluida',
    };
    const res = await request(app)
      .put(`/api/tarefas/${tarefaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe(updatedData.titulo);
    expect(res.body.descricao).toBe(updatedData.descricao);
    expect(res.body.status).toBe(updatedData.status);
  });

  it('deve deletar a tarefa', async () => {
    const res = await request(app)
      .delete(`/api/tarefas/${tarefaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Tarefa deletada com sucesso.');
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({ where: { email: user.email } });
    await prisma.$disconnect();
  });
});
