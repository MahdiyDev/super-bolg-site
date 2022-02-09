import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from 'src/admins/admins.entity';
import { AdminsService } from 'src/admins/admins.service';
import { Categories } from 'src/categories/categories.entity';
import { CategoriesService } from 'src/categories/categories.service';
import config from 'src/config';
import { PostsController } from './posts.controller';
import { Posts } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Admins, Categories]),
    MulterModule.register({
      dest: './uploads/',
    }),
    JwtModule.register({
      secret: config().secret,
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService, AdminsService, CategoriesService],
})
export class PostsModule {}
