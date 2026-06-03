import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  search(@Query('q') query?: string) {
    return this.users.search(query);
  }
}
