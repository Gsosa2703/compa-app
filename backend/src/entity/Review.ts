import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Listing } from './Listing';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.reviews)
  reviewer!: User;

  @Column()
  rating!: number;

  @Column({ type: 'text' })
  comment!: string;

  @ManyToOne(() => Listing, (listing) => listing.reviews)
  listing!: Listing;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reviewDate!: Date;
}
