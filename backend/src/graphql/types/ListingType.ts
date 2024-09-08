// src/graphql/types/ListingType.ts
import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat } from "graphql";
import { UserType } from "./UserType";  // Import the UserType to link with Listing

export const ListingType = new GraphQLObjectType({
  name: "Listing",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    user: { type: UserType },  // Relates to the user who created the listing
  }),
});
