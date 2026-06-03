import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.module';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.friendship.findMany({
      where: { OR: [{ requesterId: userId }, { receiverId: userId }] },
      include: {
        requester: { select: { id: true, username: true, profile: true } },
        receiver: { select: { id: true, username: true, profile: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async add(userId: string, receiverId: string) {
    if (userId === receiverId) throw new BadRequestException('Impossible de vous ajouter vous-meme.');
    return this.prisma.friendship.upsert({
      where: { requesterId_receiverId: { requesterId: userId, receiverId } },
      update: { status: 'PENDING' },
      create: { requesterId: userId, receiverId },
    });
  }

  async accept(userId: string, id: string) {
    const item = await this.prisma.friendship.findFirst({ where: { id, receiverId: userId } });
    if (!item) throw new NotFoundException('Demande introuvable.');
    return this.prisma.friendship.update({ where: { id }, data: { status: 'ACCEPTED' } });
  }

  async refuse(userId: string, id: string) {
    const item = await this.prisma.friendship.findFirst({ where: { id, receiverId: userId } });
    if (!item) throw new NotFoundException('Demande introuvable.');
    return this.prisma.friendship.delete({ where: { id } });
  }

  async remove(userId: string, id: string) {
    const item = await this.prisma.friendship.findFirst({ where: { id, OR: [{ requesterId: userId }, { receiverId: userId }] } });
    if (!item) throw new ForbiddenException('Action refusee.');
    return this.prisma.friendship.delete({ where: { id } });
  }

  block(userId: string, receiverId: string) {
    return this.prisma.friendship.upsert({
      where: { requesterId_receiverId: { requesterId: userId, receiverId } },
      update: { status: 'BLOCKED' },
      create: { requesterId: userId, receiverId, status: 'BLOCKED' },
    });
  }

  async unblock(userId: string, id: string) {
    const item = await this.prisma.friendship.findFirst({ where: { id, requesterId: userId, status: 'BLOCKED' } });
    if (!item) throw new NotFoundException('Blocage introuvable.');
    return this.prisma.friendship.delete({ where: { id } });
  }
}
