import "reflect-metadata"; //Ensure that reflect-metadata is imported at the top
import dotenv from "dotenv";
dotenv.config(); //Load environment variables from .env file (located in the root of the project)
import express, { Request, Response, NextFunction } from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import csrf from "csurf";
import morgan from "morgan";
import path from "path";

import { AppDataSource } from "./config/db"; // Import DB connection from separate file

import schema from "./schema";

// Initialize database connection (retry logic handled in db.ts)
import { initializeDatabase } from "./config/db";
initializeDatabase(); // Initialize the database

const app = express();

// Enable CORS with credentials (allow frontend to send cookies)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// Log HTTP requests in the backend
app.use(morgan("dev")); // Logs request method, URL, status code, and response time

// Middleware to parse cookies
app.use(cookieParser());

// CSRF Protection Middleware Setup
const csrfProtection = csrf({ cookie: true }); // CSRF tokens in cookies
app.use(csrfProtection);

// Middleware to expose CSRF token to the frontend
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("# GENERATING TOKEN .....");
  console.log("Received XSRF-TOKEN from frontend:", req.cookies["XSRF-TOKEN"]);
  const csrfToken = req.csrfToken(); // Generate CSRF token
  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false, // Allow frontend to access token
    secure: process.env.NODE_ENV === "production", // Set 'secure' flag only in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Use 'Lax' in dev, 'Strict' in production // Protect against CSRF attacks
  });
  console.log("FINISHING CSRF TOKEN.....");
  next();
});

// JWT Middleware for Authorization
app.use((req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  console.log(token, 'JWT TOKEN')
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_secret_key"
      ) as { userId: string };
      req.userId = decoded.userId; // Attach userId to the request object
    } catch (err) {
      res.clearCookie("token"); // Clear token if it's invalid
    }
  }
  next();
});

// Define routes
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.cookies["XSRF-TOKEN"] });
});

// GraphQL endpoint
app.use(`/graphql`, (req: Request, res: Response) => {
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    context:  { req: Request, res: Response },
    customFormatErrorFn: (error) => {
      console.error('[customFormatErrorFn] error', error)
      console.error(error.stack)
      const statusCode = error?.extensions?.statusCode as number || 500 

      res.status(statusCode)
      return error
    }
  })(req, res)
});

// Handle CSRF token errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === "EBADCSRFTOKEN") {
    console.error("Invalid CSRF token:", req.cookies["XSRF-TOKEN"]);
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  next(err);
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
