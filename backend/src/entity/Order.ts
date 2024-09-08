import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Listing } from './Listing';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;
  
  @ManyToOne(() => Listing, (listing) => listing.orders)
  listing!: Listing;

  @Column()
  status!: string; // e.g., "pending", "completed", etc.

  @Column("decimal")
  amount!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate!: Date;
}
