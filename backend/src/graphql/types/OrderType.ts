// src/graphql/types/OrderType.ts
import { GraphQLObjectType, GraphQLID, GraphQLFloat, GraphQLString } from "graphql";
import { UserType } from "./UserType";  // Import the UserType
import { ListingType } from "./ListingType";  // Import the ListingType

export const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    id: { type: GraphQLID },
    amount: { type: GraphQLFloat },  // Represents the amount of the order
    status: { type: GraphQLString },  // Status of the order (e.g., "pending", "completed")
    createdAt: { type: GraphQLString },  // Date when the order was created
    user: { type: UserType },  // Relates to the user who placed the order
    listing: { type: ListingType },  // Relates to the listing that was ordered
  }),
});
