import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

const validarCampos: RequestHandler = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    res.status(400).json({ erros: erros.array() });
    return;
  }
  next();
};

export default validarCampos;
