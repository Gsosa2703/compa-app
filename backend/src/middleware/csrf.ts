import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';
import express from "express";

const csrfProtection = csrf({ cookie: true });
const router = express.Router();

// Expose CSRF token
router.get("/csrf-token", csrfProtection, (req: Request, res: Response) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false, // Allow access via JavaScript
    secure: process.env.NODE_ENV === 'production', // Use 'secure' only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Use sameSite
  });
  res.status(200).json({ message: "CSRF token set." });
});

export default router; // Export the router to use in your main app

