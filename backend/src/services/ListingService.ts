import { AppDataSource } from "../config/db";
import { Listing } from "../entity/Listing";
import { User } from "../entity/User";

export class ListingService {
  // Create a new listing
  static async createListing(title: string, description: string, price: number, userId: number) {
    const listingRepository = AppDataSource.getRepository(Listing);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const newListing = listingRepository.create({
      title,
      description,
      price,
      user,
    });

    await listingRepository.save(newListing);
    return newListing;
  }

  // Get all listings
  static async getListings() {
    const listingRepository = AppDataSource.getRepository(Listing);
    return listingRepository.find({ relations: ["user"] });
  }

  // Delete a listing by listingId and userId
  static async deleteListing(listingId: number, userId: number) {
    const listingRepository = AppDataSource.getRepository(Listing);

    // Find the listing and make sure the user is the owner
    const listing = await listingRepository.findOne({
      where: { id: listingId },
      relations: ["user"],
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    // Check if the listing belongs to the user
    if (listing.user.id !== userId) {
      throw new Error("You are not authorized to delete this listing");
    }

    // Remove the listing
    await listingRepository.remove(listing);
    return true;
  }
}
