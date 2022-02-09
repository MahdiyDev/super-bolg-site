import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import config from '../config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: config().secret,
    }),
  ],
  providers: [UsersService, RegExp],
  controllers: [UsersController],
})
export class UsersModule {}
