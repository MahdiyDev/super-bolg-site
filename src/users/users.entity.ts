import { Categories } from '../categories/categories.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;
  @Column({ nullable: false, name: 'user_fullname' })
  userFullname: string;
  @Column({ nullable: false, name: 'user_username' })
  userUsername: string;
  @Column({ nullable: false, name: 'user_password' })
  userPassword: string;
  @Column({ default: false, name: 'user_is_super', nullable: false })
  userIsSuper: boolean;
  @ManyToMany(() => Categories, (category) => category.categoryId, {
    cascade: true,
  })
  @JoinTable({ name: 'user_categories' })
  userCategories: Categories[];
}
