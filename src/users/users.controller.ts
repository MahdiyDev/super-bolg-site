import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { Categories } from '../categories/categories.entity';
import { Users } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getRefAdmin(@Headers('Authorization') auth: string) {
    return this.userService.getRefUser(auth);
  }

  @Post('addcategory')
  addCategory(
    @Body() categories: Categories,
    @Headers('Authorization') auth: string,
  ) {
    return this.userService.addCategoryToUser(categories, auth);
  }

  @Post('register')
  register(@Body() user: Users) {
    return this.userService.register(user);
  }

  @Post('login')
  login(@Body() user: Users) {
    return this.userService.login(user);
  }
}
