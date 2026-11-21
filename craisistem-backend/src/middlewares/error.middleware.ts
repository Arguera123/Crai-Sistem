import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Errores de multer (p. ej. archivo demasiado grande) y de parseo JSON
  // traen su propio codigo; cualquier otro error desconocido es un 500.
  const status = err.status || err.statusCode || (err.name === 'MulterError' ? 400 : 500);

  const message =
    status === 500
      ? 'Error del servidor'
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
