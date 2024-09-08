import { Request, Response } from "express";
import { ListingService } from "../services/ListingService";

export const ListingController = {
  async createListing(req: Request, res: Response) {
    try {
      // Ensure userId is defined and convert it to a number
      const userId = req.userId ? Number(req.userId) : null;

      // If userId is not available or can't be converted, return an error
      if (!userId) {
        return res.status(400).json({ message: "Invalid or missing user ID" });
      }

      const listing = await ListingService.createListing(req.body.title, req.body.description, req.body.price, userId);
      res.status(201).json({ listing });
    } catch (error) {
      const err = error as Error;  // Cast error to Error type
      res.status(400).json({ message: err.message });
    }
  },

  async getListings(req: Request, res: Response) {
    try {
      const listings = await ListingService.getListings();
      res.status(200).json({ listings });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  },
};
