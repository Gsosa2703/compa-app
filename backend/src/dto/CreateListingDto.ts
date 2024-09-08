// src/dto/CreateListingDto.ts
import { IsString, IsNumber, Min, MaxLength } from "class-validator";

export class CreateListingDto {
  @IsString()
  @MaxLength(100)
  title!: string;  // Title of the listing, max 100 characters

  @IsString()
  description!: string;  // Description of the listing

  @IsNumber()
  @Min(0)
  price!: number;  // Price of the listing, must be non-negative

  userId!: number;  // The ID of the user who is creating the listing
}
