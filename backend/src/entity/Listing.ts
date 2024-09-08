import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Order } from "./Order";
import { Review } from "./Review";

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column("decimal")
  price!: number;

  @ManyToOne(() => User, (user) => user.listings)
  user!: User;

  @OneToMany(() => Order, (order) => order.listing, { cascade: true })
  orders!: Order[];

  @OneToMany(() => Review, (review) => review.listing, { cascade: true })
  reviews!: Review[];
}
