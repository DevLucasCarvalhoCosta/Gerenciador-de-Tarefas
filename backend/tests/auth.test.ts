import request from 'supertest';
import app from '../src/app';
import { prisma } from '../prisma/client';

jest.setTimeout(20000);

describe('Autenticação - Registro e Login', () => {
  const user = {
    nome: 'Teste Jest',
    email: `jest_${Date.now()}@mail.com`,
    senha: '123456',
  };

  it('deve registrar um novo usuário com sucesso', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('nome', user.nome);
    expect(res.body).toHaveProperty('email', user.email);
  });

  it('deve fazer login com o usuário registrado', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, senha: user.senha });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  afterAll(async () => {
    await prisma.usuario.deleteMany({ where: { email: user.email } });
    await prisma.$disconnect();
  });
});
