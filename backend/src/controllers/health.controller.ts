import { Request, Response } from 'express';

export const checkHealth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'NOVAX API is running smoothly.',
    timestamp: new Date().toISOString()
  });
};
