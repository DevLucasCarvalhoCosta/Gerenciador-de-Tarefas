import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';

const register: RequestHandler = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      res.status(400).json({ message: "Email já cadastrado." });
      return;
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada
      }
    });

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar." });
  }
};

const login: RequestHandler = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      res.status(401).json({ message: "Senha inválida." });
      return;
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
    );

    res.json({ token, nome: usuario.nome, id: usuario.id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};

export default { register, login };
