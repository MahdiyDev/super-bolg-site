import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../categories/categories.entity';
import regExp from '../regExp';
import { Repository } from 'typeorm';
import { Admins } from './admins.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admins)
    private adminsReposity: Repository<Admins>,
    private jwtService: JwtService,
  ) {}

  async register(admin: Admins, auth: string) {
    try {
      const superAdmin = await this.auth(auth);

      if (typeof auth === 'undefined' || !superAdmin.adminIsSuper)
        return { message: 'Not Allowed' };

      if (!admin.adminUsername || !admin.adminPassword)
        return new BadRequestException();

      const checkUsername = regExp.checkEmail(admin.adminUsername);

      if (!checkUsername)
        return {
          message: 'The username must contain a special character',
          status: 400,
        };

      const checkPass = regExp.checkPassword(admin.adminPassword);

      if (!checkPass)
        return {
          message:
            'The password must consist of at least one number and at least one special character',
          status: 400,
        };

      const foundAdmin = await this.adminsReposity.findOne({
        adminUsername: admin.adminUsername,
      });

      if (!foundAdmin) {
        const newAdmin = this.adminsReposity.create(admin);
        await this.adminsReposity.save(newAdmin);
        return { message: 'created' };
      } else {
        return {
          message: 'Try another username',
          status: 400,
        };
      }
    } catch (_) {
      console.log(_);

      return new InternalServerErrorException();
    }
  }

  async loginAdmin(admin: Admins) {
    try {
      if (!admin.adminUsername || !admin.adminPassword)
        return new BadRequestException();

      const checkUsername = regExp.checkEmail(admin.adminUsername);

      if (!checkUsername)
        return {
          message: 'The username must contain a special character',
          status: 400,
        };

      const checkPass = regExp.checkPassword(admin.adminPassword);

      if (!checkPass)
        return {
          message:
            'The password must consist of at least one number and at least one special character',
          status: 400,
        };

      const foundAdmin = await this.adminsReposity.findOne({
        adminUsername: admin.adminUsername,
      });

      if (foundAdmin) {
        const jwt = await this.jwtService.signAsync({
          id: foundAdmin.adminId,
        });
        return { accessToken: 'Bearer ' + jwt };
      } else {
        return new UnauthorizedException();
      }
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async getRefAdmin(auth: string) {
    try {
      const access = await this.auth(auth);
      if (!access.adminId) return { message: 'Not Allowed' };
      return await this.adminsReposity.findOne(
        { adminId: access.adminId },
        {
          relations: ['adminCategories'],
          select: ['adminId', 'adminUsername'],
        },
      );
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async auth(token: string): Promise<any> {
    try {
      const accessToken = token.split(' ')[1];
      const parseToken = await this.jwtService.verifyAsync(accessToken);
      const foundAdmin = await this.adminsReposity.findOne({
        adminId: parseToken.id,
      });
      return foundAdmin.adminId ? foundAdmin : undefined;
    } catch (_) {
      return undefined;
    }
  }

  async createRefAdmin(id: string, newCategory: Categories[]) {
    const foundAdmin = await this.findRefAdmin(id);

    if (!foundAdmin.adminCategories.length) {
      foundAdmin.adminCategories = [...newCategory];

      await this.adminsReposity.save(foundAdmin);
    } else {
      foundAdmin.adminCategories = [
        ...newCategory,
        ...foundAdmin.adminCategories,
      ];

      await this.adminsReposity.save(foundAdmin);
    }
  }

  async findRefAdmin(id: string) {
    const foundAdmin = await this.adminsReposity.findOne(
      { adminId: id },
      { relations: ['adminCategories'] },
    );

    return foundAdmin;
  }
}
