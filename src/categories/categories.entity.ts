import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Categories {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  categoryId: string;
  @Column({ nullable: false, name: 'category_name' })
  categoryName: string;
  @Column('timestamp with time zone', {
    name: 'category_date',
    default: new Date(),
  })
  categoryDate: Date;
}
