import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.module';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [users, online, newAccounts, messages, logs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { lastSeenAt: { gte: new Date(Date.now() - 10 * 60 * 1000) } } }),
      this.prisma.user.count({ where: { createdAt: { gte: since } } }),
      this.prisma.message.count({ where: { createdAt: { gte: since } } }),
      this.prisma.auditLog.findMany({ take: 30, orderBy: { createdAt: 'desc' }, include: { actor: { select: { username: true } } } }),
    ]);

    return { users, online, newAccounts, messages24h: messages, logs };
  }

  users() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, username: true, role: true, createdAt: true, lastSeenAt: true, profile: true },
      take: 100,
    });
  }

  logs() {
    return this.prisma.auditLog.findMany({ take: 100, orderBy: { createdAt: 'desc' }, include: { actor: { select: { username: true } } } });
  }

  channels() {
    return this.prisma.channel.findMany({ orderBy: { createdAt: 'asc' } });
  }

  createChannel(name: string, slug: string, description: string) {
    return this.prisma.channel.create({ data: { name, slug, description, type: 'PUBLIC' } });
  }
}
