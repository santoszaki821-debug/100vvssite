import { BadRequestException, Injectable } from '@nestjs/common';
import sanitizeHtml = require('sanitize-html');
import { PrismaService } from '../prisma.module';
import { UpdateProfileDto } from './dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true, createdAt: true, profile: true, badges: { include: { badge: true } } },
    });
  }

  async update(userId: string, dto: UpdateProfileDto) {
    if (dto.displayName) {
      const exists = await this.prisma.profile.findUnique({ where: { displayName: dto.displayName } });
      if (exists && exists.userId !== userId) throw new BadRequestException('Ce pseudo est deja pris.');
    }
    return this.prisma.profile.update({
      where: { userId },
      data: {
        ...dto,
        bio: dto.bio === undefined ? undefined : sanitizeHtml(dto.bio, { allowedTags: [], allowedAttributes: {} }),
        status: dto.status === undefined ? undefined : sanitizeHtml(dto.status, { allowedTags: [], allowedAttributes: {} }),
      },
    });
  }

  list() {
    return this.prisma.user.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: { id: true, username: true, role: true, createdAt: true, lastSeenAt: true, profile: true, badges: { include: { badge: true } } },
    });
  }
}
