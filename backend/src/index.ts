import "reflect-metadata";  // Ensure that reflect-metadata is imported at the top
import dotenv from "dotenv";
dotenv.config();  // Load environment variables from .env file

import express, { Request, Response, NextFunction } from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import csrf from "csurf";
import morgan from "morgan";

import { errorMiddleware } from "./middleware/errorMiddleware";  // Error handling middleware
import { apiRateLimiter } from "./middleware/rateLimiter";  // Rate limiter middleware
import logger from "./utils/logger";  // Import the logger

import { AppDataSource } from "./config/db";  // Import DB connection
import schema from "./graphql/schema";  // Import GraphQL schema

// Initialize database connection
import { initializeDatabase } from "./config/db";
initializeDatabase();  // Initialize the database

const app = express();

// Enable CORS with credentials (allow frontend to send cookies)
app.use(cors({
  origin: "http://localhost:3000",  // Allow requests from frontend URL
  credentials: true,  // Allow cookies to be sent
}));

// Log incoming HTTP requests using Morgan (this logs simple requests in the console)
app.use(morgan("dev"));

// Parse cookies
app.use(cookieParser());

// CSRF Protection Middleware Setup
const csrfProtection = csrf({ cookie: true });  // CSRF tokens in cookies

// Apply rate-limiting to API routes
app.use("/api", apiRateLimiter);

// Apply logging for every incoming request
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);  // Log the request method and URL
  next();
});

// Expose CSRF token only for specific route
app.get("/csrf-token", csrfProtection, (req: Request, res: Response) => {
  const csrfToken = req.csrfToken();  // Generate CSRF token
  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false,  // Allow frontend to access token
    secure: process.env.NODE_ENV === "production",  // Secure cookie in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",  // Use 'Lax' in dev, 'Strict' in production
  });
  res.status(200).json({ csrfToken });
});

// JWT Middleware for Authorization
app.use((req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key") as { userId: string };
      req.userId = decoded.userId;  // Attach userId to the request object
    } catch (err) {
      res.clearCookie("token");  // Clear token if it's invalid
    }
  }
  next();
});

// GraphQL endpoint
app.use(`/graphql`, (req: Request, res: Response) => {
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    context: { req, res },
    customFormatErrorFn: (error) => {
      logger.error(`[GraphQL Error] ${error.message}`, { stack: error.stack });  // Log the error with Winston
      const statusCode = error?.extensions?.statusCode as number || 500;
      res.status(statusCode);
      return error;
    },
  })(req, res);
});

// Handle CSRF token errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === "EBADCSRFTOKEN") {
    logger.error("Invalid CSRF token", { token: req.cookies["XSRF-TOKEN"] });  // Log CSRF token errors
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  next(err);
});

// Global error handler middleware (log errors with Winston)
app.use(errorMiddleware);

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);  // Log server start
});


