// src/middleware/validateSignup.ts
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation rules for sign-up
export const validateSignup = [
  body("name").isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
