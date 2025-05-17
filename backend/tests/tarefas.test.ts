import request from 'supertest';
import app from '../src/app';
import { prisma } from '../prisma/client';

jest.setTimeout(10000);

describe('Tarefas - CRUD completo com autenticação', () => {
  const user = {
    nome: 'Usuário Tarefa',
    email: `tarefa_${Date.now()}@mail.com`,
    senha: '123456'
  };

  let token: string;
  let tarefaId: number;

  beforeAll(async () => {
    // Registra o usuário
    await request(app).post('/api/auth/register').send(user);

    // Faz login e salva o token
    const res = await request(app).post('/api/auth/login').send({
      email: user.email,
      senha: user.senha
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
    const res = await request(app)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Tarefa de Teste',
        descricao: 'Criada pelo Jest'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Tarefa criada com sucesso!');
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
    const res = await request(app)
      .put(`/api/tarefas/${tarefaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Tarefa Atualizada',
        descricao: 'Descrição alterada via Jest',
        status: 'concluida'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Tarefa atualizada com sucesso!');
  });

  it('deve deletar a tarefa', async () => {
    const res = await request(app)
      .delete(`/api/tarefas/${tarefaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Tarefa deletada com sucesso!');
  });

  afterAll(async () => {
    await prisma.tarefa.deleteMany({
      where: { usuario: { email: user.email } }
    });

    await prisma.usuario.deleteMany({
      where: { email: user.email }
    });

    await prisma.$disconnect();
  });
});
