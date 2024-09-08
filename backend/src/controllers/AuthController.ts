import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export const AuthController = {
  async signUp(req: Request, res: Response) {
    try {
      const token = await AuthService.signUp(req.body.email, req.body.password);
      res.cookie("token", token, { httpOnly: true });
      res.status(201).json({ message: "User created" });
    } catch (error) {
      const err = error as Error;  // Cast error to Error type
      res.status(400).json({ message: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const token = await AuthService.login(req.body.email, req.body.password);
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      const err = error as Error;  // Cast error to Error type
      res.status(400).json({ message: err.message });
    }
  },
};
