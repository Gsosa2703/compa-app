// src/graphql/mutations/userMutations.ts
import { GraphQLString, GraphQLNonNull } from "graphql";
import { UserType } from "../types/UserType";
import { AuthSignUpType } from "../types/AuthType";
import { AuthService } from "../../services/AuthService";

export const userMutations = {
  signUp: {
    type: AuthSignUpType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent: any, args: any, context: any) {

      console.info(args, 'ARGS BACKEND [SIGNUP]')

      const { name, email, password } = args;

      // Proceed with user sign-up if validation passes
      const newUser = await AuthService.signUp(name, email, password);

      console.log(newUser, 'USER SIGNED UP')
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
