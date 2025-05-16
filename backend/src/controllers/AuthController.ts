import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db";

class AuthController {
  static async register(req: Request, res: Response) {
    const { nome, email, senha } = req.body;

    try {
      const [user] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      if ((user as any[]).length > 0) {
        return res.status(400).json({ message: "Email já cadastrado." });
      }

      const senhaCriptografada = await bcrypt.hash(senha, 10);
      await db.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senhaCriptografada]);
      res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao registrar." });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    try {
      const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      const usuario = (rows as any[])[0];
      if (!usuario) return res.status(404).json({ message: "Usuário não encontrado." });

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) return res.status(401).json({ message: "Senha inválida." });

      const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET!, {
        expiresIn: "8h",
      });

      res.json({ token, nome: usuario.nome, id: usuario.id });
    } catch (error) {
      res.status(500).json({ error: "Erro ao fazer login." });
    }
  }
}

export default AuthController;