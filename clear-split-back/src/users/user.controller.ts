import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    const userId = req.user.sub;
    return this.usersService.findById(userId);
  }

  @Post('bulk')
  findMany(@Body() body: { ids: string[] }) {
    return this.usersService.findManyByIds(body.ids);
  }
}
