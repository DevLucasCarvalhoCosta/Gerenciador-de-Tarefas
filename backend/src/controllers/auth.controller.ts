import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { nome, email, senha } = req.body;
    const user = await AuthService.register(nome, email, senha);
    res.status(201).json(user);
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    const data = await AuthService.login(email, senha);
    res.json(data);
  });
}
