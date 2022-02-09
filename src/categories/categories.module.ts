import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from 'src/admins/admins.entity';
import { AdminsService } from 'src/admins/admins.service';
import config from 'src/config';
import { CategoriesController } from './categories.controller';
import { Categories } from './categories.entity';
import { CategoriesService } from './categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categories, Admins]),
    JwtModule.register({
      secret: config().secret,
    }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, AdminsService],
})
export class CategoriesModule {}
