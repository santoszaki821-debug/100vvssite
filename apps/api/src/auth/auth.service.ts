import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma.module';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: AuthDto, ip?: string, userAgent?: string) {
    const exists = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (exists) throw new BadRequestException('Ce pseudo est deja utilise.');

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 3,
      parallelism: 1,
    });

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        profile: {
          create: {
            displayName: dto.username,
            avatarUrl: '/avatar-default.svg',
            bannerUrl: '/banner-premium.svg',
            visibleBadges: ['member'],
          },
        },
      },
      include: { profile: true },
    });
    await this.audit(user.id, 'auth.register', 'User', user.id, ip);
    return this.issueToken(user.id, user.username, user.role, ip, userAgent);
  }

  async login(dto: AuthDto, ip?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      await this.audit(undefined, 'auth.failed_login', 'User', undefined, ip, { username: dto.username });
      throw new UnauthorizedException('Identifiants invalides.');
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastSeenAt: new Date() } });
    await this.audit(user.id, 'auth.login', 'User', user.id, ip);
    return this.issueToken(user.id, user.username, user.role, ip, userAgent);
  }

  private async issueToken(userId: string, username: string, role: Role, ip?: string, userAgent?: string) {
    await this.prisma.session.create({ data: { userId, ip, userAgent } });
    return {
      accessToken: await this.jwt.signAsync({ sub: userId, username, role }),
      user: { id: userId, username, role },
    };
  }

  private audit(actorId: string | undefined, action: string, entity: string, entityId?: string, ip?: string, metadata?: object) {
    return this.prisma.auditLog.create({ data: { actorId, action, entity, entityId, ip, metadata } });
  }
}
