import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import regExp from '../regExp';
import { Categories } from '../categories/categories.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersReposity: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async register(user: Users) {
    try {
      if (!user.userUsername || !user.userPassword)
        return new BadRequestException();

      const checkUsername = regExp.checkEmail(user.userUsername);

      if (!checkUsername)
        return {
          message: 'The username must contain a special character',
          status: 400,
        };

      const checkPass = regExp.checkPassword(user.userPassword);

      if (!checkPass)
        return {
          message:
            'The password must consist of at least one number and at least one special character',
          status: 400,
        };

      const foundUser = await this.usersReposity.findOne({
        userUsername: user.userUsername,
      });

      if (!foundUser) {
        const newUser = this.usersReposity.create(user);
        await this.usersReposity.save(newUser);
        const jwt = await this.jwtService.signAsync({
          id: newUser.userId,
        });
        return { accessToken: 'Bearer ' + jwt };
      } else {
        return {
          message: 'Try another username',
          status: 400,
        };
      }
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async login(user: Users) {
    try {
      if (!user.userUsername || !user.userPassword || !user.userFullname)
        return new BadRequestException();

      const checkUsername = regExp.checkEmail(user.userUsername);

      if (!checkUsername)
        return {
          message: 'The username must contain a special character',
          status: 400,
        };

      const checkPass = regExp.checkPassword(user.userPassword);

      if (!checkPass)
        return {
          message:
            'The password must consist of at least one number and at least one special character',
          status: 400,
        };

      const founduser = await this.usersReposity.findOne({
        userUsername: user.userUsername,
        userPassword: user.userPassword,
      });

      if (founduser) {
        const jwt = await this.jwtService.signAsync({
          id: founduser.userId,
        });
        return { accessToken: 'Bearer ' + jwt };
      } else {
        return new UnauthorizedException();
      }
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async addCategoryToUser(category: Categories, auth: string) {
    try {
      const foundUser = await this.getRefUser(auth);
      if (!foundUser.userId || typeof auth === 'undefined')
        return { message: 'Not Allowed' };

      if (!category.categoryId) return new BadRequestException();

      const foundCategory = foundUser.userCategories.find(
        (c) => c.categoryId === category.categoryId,
      );
      if (foundCategory)
        return { message: 'This category has already been added.' };

      foundUser.userCategories = [category];

      await this.usersReposity.save(foundUser);
      return { message: 'Category Added' };
    } catch (_) {
      return new InternalServerErrorException();
    }
  }

  async getRefUser(auth: string): Promise<any> {
    try {
      const access = await this.auth(auth);
      if (!access.userId) return { message: 'Not Allowed' };
      return await this.usersReposity.findOne(
        { userId: access.userId },
        {
          relations: ['userCategories'],
          select: ['userId', 'userUsername'],
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
      const foundUser = await this.usersReposity.findOne({
        userId: parseToken.id,
      });
      return foundUser.userId ? foundUser : undefined;
    } catch (_) {
      return undefined;
    }
  }
}
