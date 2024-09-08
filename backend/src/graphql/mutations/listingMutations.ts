// src/graphql/mutations/listingMutations.ts
import { GraphQLString, GraphQLFloat, GraphQLNonNull } from "graphql";
import { ListingType } from "../types/ListingType";
import { ListingService } from "../../services/ListingService";

export const listingMutations = {
  createListing: {
    type: ListingType,
    args: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: new GraphQLNonNull(GraphQLString) },
      price: { type: new GraphQLNonNull(GraphQLFloat) },
    },
    async resolve(parent: any, args: any, context: any) {
      const { title, description, price } = args;
      const userId = context.req.userId;  // Ensure the user is authenticated
      if (!userId) {
        throw new Error("Unauthorized");
      }

      // Pass all 4 arguments as required by ListingService.createListing
      const newListing = await ListingService.createListing(title, description, price, Number(userId));
      return newListing;
    },
  },
  deleteListing: {
    type: GraphQLString,
    args: {
      listingId: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent: any, args: any, context: any) {
      const { listingId } = args;
      const userId = context.req.userId;  // Ensure the user is authenticated
      if (!userId) {
        throw new Error("Unauthorized");
      }

      // Call the correctly defined deleteListing method
      await ListingService.deleteListing(Number(listingId), Number(userId));
      return "Listing deleted successfully";
    },
  },
};
