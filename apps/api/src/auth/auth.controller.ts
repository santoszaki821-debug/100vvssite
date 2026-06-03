import { Body, Controller, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  register(@Body() dto: AuthDto, @Req() req: Request) {
    return this.auth.register(dto, req.ip, req.headers['user-agent']);
  }

  @Post('login')
  @Throttle({ default: { ttl: 60_000, limit: 8 } })
  login(@Body() dto: AuthDto, @Req() req: Request) {
    return this.auth.login(dto, req.ip, req.headers['user-agent']);
  }
}
