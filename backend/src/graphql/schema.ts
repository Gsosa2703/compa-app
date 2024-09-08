// src/graphql/schema.ts
import { GraphQLSchema, GraphQLObjectType, GraphQLList } from "graphql";
import { userMutations } from "./mutations/userMutations";
import { listingMutations } from "./mutations/listingMutations";
import { handleError } from "../utils/errorHandler"; 
import { AppDataSource } from "../config/db";
import { UserType } from "./types/UserType";
import { User } from "../entity/User";

// RootQuery for querying users (example for testing)
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
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
    // You can add more queries like listings, orders, etc., in the future
  },
});

// RootMutation combines all mutations
const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...userMutations,  // Integrate user-related mutations (signup, login)
    ...listingMutations,  // Integrate listing-related mutations (create, delete listing)
  },
});

// Export the complete schema
export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
