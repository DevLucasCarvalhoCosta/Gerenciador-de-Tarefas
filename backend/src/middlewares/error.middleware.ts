import { ErrorRequestHandler } from 'express';

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
};