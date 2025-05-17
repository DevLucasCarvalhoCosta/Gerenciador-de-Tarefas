import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: number;
  email: string;
  nome: string;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido.' });
    return;
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido.' });
    return;
  }
};
