import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AdminsModule } from './admins/admins.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    AdminsModule,
    CategoriesModule,
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
