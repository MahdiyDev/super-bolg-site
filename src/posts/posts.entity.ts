import { Admins } from '../admins/admins.entity';
import { Categories } from '../categories/categories.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn('uuid', { name: 'post_id' })
  postId: string;
  @Column({ nullable: false, name: 'post_title' })
  postTitle: string;
  @Column({ nullable: false, name: 'post_content' })
  postContent: string;
  @Column({ nullable: false, name: 'post_image' })
  postImage: string;
  @Column('timestamp with time zone', {
    name: 'post_date',
    default: new Date(),
  })
  postDate: Date;
  @ManyToOne(() => Admins, (admin) => admin.adminPost)
  @JoinColumn({ name: 'post_owner' })
  postOwner: Admins;
  @ManyToMany(() => Categories, (category) => category.categoryId, {
    cascade: true,
  })
  @JoinTable({ name: 'post_category' })
  postCategory: Categories[];
}
