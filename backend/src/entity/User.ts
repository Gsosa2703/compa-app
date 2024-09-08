import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Listing } from "./Listing";  // Import Listing entity
import { Order } from "./Order";  // Import Order entity
import { Review } from "./Review";  // Import Review entity
import { IsEmail, Length } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Length(3, 50, { message: "Name must be between 3 and 50 characters" }) // Ensures name is between 3 and 50 characters
  name!: string;

  @Column({ unique: true })
  @IsEmail({}, { message: "Invalid email" }) // Email must follow proper format
  email!: string;

  @Column()
  @Length(6, 100, { message: "Password must be at least 6 characters" }) // Validating password length
  password!: string;

  // Initialize listings, orders, and reviews as empty arrays
  @OneToMany(() => Listing, (listing) => listing.user, { cascade: true })
  listings!: Listing[];

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders!: Order[];

  @OneToMany(() => Review, (review) => review.reviewer, { cascade: true })
  reviews!: Review[];

}
