import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';
import { AdminsController } from './admins.controller';
import { Admins } from './admins.entity';
import { AdminsService } from './admins.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admins]),
    JwtModule.register({
      secret: config().secret,
    }),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
