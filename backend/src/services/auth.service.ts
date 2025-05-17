import { prisma } from '../../prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../middlewares/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET!;

export class AuthService {
  static async register(nome: string, email: string, senha: string) {
    const existing = await prisma.usuario.findUnique({ where: { email } });
    if (existing) throw { status: 400, message: 'Email já cadastrado.' };

    const hash = await bcrypt.hash(senha, 10);
    const user = await prisma.usuario.create({ data: { nome, email, senha: hash } });
    const { senha: _, ...rest } = user;
    return rest;
  }

  static async login(email: string, senha: string) {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) throw { status: 404, message: 'Usuário não encontrado.' };

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) throw { status: 401, message: 'Senha inválida.' };

    const payload: JwtPayload = { id: user.id, nome: user.nome, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    return { token, user: payload };
  }
}