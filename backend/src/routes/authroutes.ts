import express from 'express';
import AuthController from '../controllers/AuthController';
import { check } from 'express-validator';
import validarCampos from '../middlewares/validarCampos';

const router = express.Router();

router.post(
  '/register',
  [
    check('nome', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Email inválido').isEmail(),
    check('senha', 'A senha deve ter no mínimo 6 caracteres').isLength({ min: 6 }),
    validarCampos
  ],
  AuthController.register
);

router.post(
  '/login',
  [
    check('email', 'Email inválido').isEmail(),
    check('senha', 'Senha é obrigatória').not().isEmpty(),
    validarCampos
  ],
  AuthController.login
);

export default router;
