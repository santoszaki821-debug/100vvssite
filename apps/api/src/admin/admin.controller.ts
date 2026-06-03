import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { IsString, Length, Matches } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

class ChannelDto {
  @IsString()
  @Length(3, 40)
  name!: string;

  @IsString()
  @Length(3, 40)
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;

  @IsString()
  @Length(0, 160)
  description!: string;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.FOUNDER)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  stats() {
    return this.admin.stats();
  }

  @Get('users')
  users() {
    return this.admin.users();
  }

  @Get('logs')
  logs() {
    return this.admin.logs();
  }

  @Get('channels')
  channels() {
    return this.admin.channels();
  }

  @Post('channels')
  createChannel(@Body() dto: ChannelDto) {
    return this.admin.createChannel(dto.name, dto.slug, dto.description);
  }
}
