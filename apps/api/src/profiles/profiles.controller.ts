import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto';
import { ProfilesService } from './profiles.service';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profiles: ProfilesService) {}

  @Get('me')
  me(@CurrentUser() user: RequestUser) {
    return this.profiles.me(user.sub);
  }

  @Patch('me')
  update(@CurrentUser() user: RequestUser, @Body() dto: UpdateProfileDto) {
    return this.profiles.update(user.sub, dto);
  }

  @Get()
  list() {
    return this.profiles.list();
  }
}
