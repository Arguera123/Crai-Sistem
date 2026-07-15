import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;

  const message =
    status === 500
      ? 'Error del servior'
      : err.message || 'Algo salio mal';

  console.error(`[${req.method}] ${req.originalUrl} -> ${message}`);
  if (status === 500) {
    console.error(err.stack);
  }

  // Enviar respuesta
  res.status(status).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && status === 500
      ? { stack: err.stack }
      : {}),
  });
};
