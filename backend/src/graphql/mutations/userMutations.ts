// src/graphql/mutations/userMutations.ts
import { GraphQLString, GraphQLNonNull } from "graphql";
import { UserType } from "../types/UserType";
import { AuthService } from "../../services/AuthService";
import { body, validationResult } from "express-validator";

export const userMutations = {
  signUp: {
    type: UserType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent: any, args: any, context: any) {
      const { name, email, password } = args;

      // Apply validation rules for sign-up manually
      await body("name").isLength({ min: 3, max: 50 }).withMessage("Name must be between 3 and 50 characters").run(context.req);
      await body("email").isEmail().withMessage("Email must be valid").run(context.req);
      await body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").run(context.req);

      // Check for validation errors
      const errors = validationResult(context.req);
      if (!errors.isEmpty()) {
        throw new Error(JSON.stringify(errors.array()));  // Throw error if validation fails
      }

      // Proceed with user sign-up if validation passes
      const newUser = await AuthService.signUp(email, password);
      return newUser;
    },
  },

  login: {
    type: UserType,
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent: any, args: any, context: any) {
      const { email, password } = args;

      const { token, user } = await AuthService.login(email, password);
      context.res.cookie("token", token, { httpOnly: true });
      return user;
    },
  },
};
