import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } from "graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { createError, handleError } from "./utils/errorHandler"; // Import the error handler
import { AppDataSource } from "./config/db"; // Import your database connection
import { User } from "./entity/User"; // Import the User entity

// Define User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
  },
});

// Define Root Mutation: Signup and Login
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Signup Mutation
    signup: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent: any, args: any, context: { req: Request, res: Response }) {
        try {
          // Check if the user already exists
          const userRepo = AppDataSource.getRepository(User);
          const userExists = await userRepo.findOne({ where: { email: args.email } });

          if (userExists) {
            throw createError('User already exists', 409, { email: args.email });
          }

          const hashedPassword = await bcrypt.hash(args.password, 12);
          const newUser = userRepo.create({
            name: args.name,
            email: args.email,
            password: hashedPassword,
          });

          await userRepo.save(newUser);

          // Generate JWT Token
          const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

          // Set cookie with HttpOnly and Secure flags
          context.res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // Token expires in 1 hour
            sameSite: 'lax', // Prevent CSRF
          });

          return newUser;
        } catch (error) {
          const handledError = handleError(error);
          throw new Error(handledError.message);
        }
      }
    },

    // Login Mutation
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent: any, args: any, context: { req: Request, res: Response }) {
        try {
          const userRepo = AppDataSource.getRepository(User);
          const user = await userRepo.findOne({ where: { email: args.email } });

          if (!user) {
            throw createError('User not found', 404, { email: args.email });
          }

          const isPasswordValid = await bcrypt.compare(args.password, user.password);
          if (!isPasswordValid) {
            throw createError('Invalid credentials', 401);
          }

          // Generate JWT Token
          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

          // Set cookie with HttpOnly and Secure flags
          context.res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
            sameSite: 'lax', // Prevent CSRF
          });

          return user;
        } catch (error) {
          const handledError = handleError(error);
          throw new Error(handledError.message);
        }
      }
    }
  }
});

// Define Root Query: For testing purposes, let's query all users
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // List users (for testing purposes)
    users: {
      type: new GraphQLList(UserType),
      async resolve() {
        try {
          const userRepo = AppDataSource.getRepository(User);
          const users = await userRepo.find();
          return users;
        } catch (error) {
          const handledError = handleError(error);
          throw new Error(handledError.message);
        }
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

