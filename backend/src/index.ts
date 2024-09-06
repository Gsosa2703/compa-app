import 'reflect-metadata'; // Ensure that reflect-metadata is imported at the top
import dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import express, { Request, Response, NextFunction } from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import csrf from 'csurf';

import schema from './schema'; // Assuming schema.ts is correctly set up

// Initialize TypeORM Data Source for PostgreSQL
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "postgres", // Using environment variables
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || "clercminator",
  password: process.env.DATABASE_PASSWORD || "123",
  database: process.env.DATABASE_NAME || "compa-app",
  synchronize: true, // Auto sync DB schema, turn off in production
  logging: true, // Log database queries and errors
  entities: [__dirname + "/entity/**/*.ts"], // Define the entities location
  migrations: [__dirname + "/migration/**/*.ts"],
  subscribers: [__dirname + "/subscriber/**/*.ts"],
});

// Retry connection logic to ensure stable connection to the database
const retryConnect = async (retries: number = 5, delay: number = 5000) => {
  while (retries) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
      return;
    } catch (err) {
      console.error(`Error during Data Source initialization: ${err}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        throw new Error("Could not connect to the database after several retries");
      }
      await new Promise(res => setTimeout(res, delay)); // Wait before retrying
    }
  }
};

retryConnect(); // Call the retry connection function

const app = express();

// Enable CORS with credentials (allow frontend to send cookies)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// Middleware to parse cookies
app.use(cookieParser());

// CSRF Protection Middleware Setup
const csrfProtection = csrf({ cookie: true }); // CSRF tokens in cookies
app.use(csrfProtection);

// Middleware to expose CSRF token to the frontend
app.use((req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.csrfToken(); // Generate CSRF token
  res.cookie('XSRF-TOKEN', csrfToken, {
    httpOnly: false, // Allow frontend to access token
    secure: process.env.NODE_ENV === 'production', // Set 'secure' flag only in production
    sameSite: process.env.NODE_ENV === 'production' ? "strict" : "lax", // Use 'Lax' in dev, 'Strict' in production // Protect against CSRF attacks
  });
  next();
});

// JWT Middleware for Authorization
app.use((req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, 'your_secret_key') as { userId: string };
      req.userId = decoded.userId; // Attach userId to the request object
    } catch (err) {
      res.clearCookie('token'); // Clear token if it's invalid
    }
  }
  next();
});

// GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema, // Use the GraphQL schema
    graphiql: true, // Enable the GraphiQL interface for testing in browser
  })
);

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
