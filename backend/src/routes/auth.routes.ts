import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { check } from 'express-validator';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
router.post(
  '/register',
  [
    check('nome').notEmpty().withMessage('Nome obrigatório'),
    check('email').isEmail().withMessage('Email inválido'),
    check('senha').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres'),
    validationMiddleware
  ],
  AuthController.register
);
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Email inválido'),
    check('senha').notEmpty().withMessage('Senha obrigatória'),
    validationMiddleware
  ],
  AuthController.login
);
export default router;