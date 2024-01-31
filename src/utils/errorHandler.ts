import { NextFunction, Request, Response } from 'express';

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  res.status(res.statusCode).json({ error: { message: err.message } });
  next();
};

export default errorHandler;
