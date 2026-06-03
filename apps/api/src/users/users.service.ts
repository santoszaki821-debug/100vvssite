import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.module';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  search(query = '') {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { profile: { displayName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      take: 20,
      select: { id: true, username: true, role: true, createdAt: true, lastSeenAt: true, profile: true, badges: { include: { badge: true } } },
    });
  }
}
