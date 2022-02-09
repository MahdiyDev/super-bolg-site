import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { Admins } from './admins.entity';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  @Get()
  getRefAdmin(@Headers('Authorization') auth: string) {
    return this.adminService.getRefAdmin(auth);
  }

  @Post('register')
  register(@Body() admin: Admins, @Headers('Authorization') auth: string) {
    return this.adminService.register(admin, auth);
  }

  @Post('login')
  login(@Body() admin: Admins) {
    return this.adminService.loginAdmin(admin);
  }
}
