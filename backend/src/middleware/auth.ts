import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key') as { userId: string };
      req.userId = decoded.userId;
    } catch (err) {
      res.clearCookie('token');
    }
  }
  next();
};
