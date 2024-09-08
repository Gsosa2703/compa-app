// To ensure that unhandled errors (thrown from routes or services) are properly caught and logged, and to send a structured response to the client.
import { Request, Response, NextFunction } from "express";
import { handleError } from "../utils/errorHandler";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message, data } = handleError(err);
  res.status(statusCode).json({ message, data });
};
