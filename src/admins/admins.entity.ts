import { Categories } from '../categories/categories.entity';
import { Posts } from '../posts/posts.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Admins {
  @PrimaryGeneratedColumn('uuid', { name: 'admin_id' })
  adminId: string;
  @Column({ nullable: false, name: 'admin_username' })
  adminUsername: string;
  @Column({ nullable: false, name: 'admin_password' })
  adminPassword: string;
  @Column({ default: false, name: 'admin_is_super', nullable: false })
  adminIsSuper: boolean;
  @ManyToMany(() => Categories, (category) => category.categoryId, {
    cascade: true,
  })
  @JoinTable({ name: 'admin_categories' })
  adminCategories: Categories[];
  @OneToMany(() => Posts, (post) => post.postOwner)
  adminPost: Posts[];
}
