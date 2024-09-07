import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

export const exposeCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });
  res.status(200).json({ message: "CSRF token set." });
  next();
};

export { csrfProtection };
