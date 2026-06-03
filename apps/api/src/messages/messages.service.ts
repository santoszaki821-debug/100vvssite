import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import sanitizeHtml = require('sanitize-html');
import { PrismaService } from '../prisma.module';
import { CreateMessageDto, PinDto, ReactionDto, UpdateMessageDto } from './dto';

const messageInclude = {
  author: { select: { id: true, username: true, role: true, profile: true, badges: { include: { badge: true } } } },
  reactions: true,
  replyTo: true,
} as const;

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  channels() {
    return this.prisma.channel.findMany({ where: { type: 'PUBLIC' }, orderBy: { createdAt: 'asc' } });
  }

  history(channelId: string) {
    return this.prisma.message.findMany({
      where: { channelId, isDeleted: false },
      include: messageInclude,
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  }

  async create(authorId: string, dto: CreateMessageDto) {
    if (!dto.channelId && !dto.recipientId) throw new NotFoundException('Salon ou destinataire requis.');
    return this.prisma.message.create({
      data: {
        authorId,
        channelId: dto.channelId,
        recipientId: dto.recipientId,
        body: sanitizeHtml(dto.body, { allowedTags: [], allowedAttributes: {} }),
        imageUrl: dto.imageUrl,
        gifUrl: dto.gifUrl,
        replyToId: dto.replyToId,
      },
      include: messageInclude,
    });
  }

  async update(userId: string, id: string, dto: UpdateMessageDto) {
    const message = await this.getOwned(userId, id);
    return this.prisma.message.update({
      where: { id: message.id },
      data: { body: sanitizeHtml(dto.body, { allowedTags: [], allowedAttributes: {} }), editedAt: new Date() },
      include: messageInclude,
    });
  }

  async remove(userId: string, id: string, role: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) throw new NotFoundException('Message introuvable.');
    if (message.authorId !== userId && !['ADMIN', 'FOUNDER', 'MODERATOR'].includes(role)) {
      throw new ForbiddenException('Action refusee.');
    }
    return this.prisma.message.update({ where: { id }, data: { isDeleted: true, body: 'Message supprime' } });
  }

  react(userId: string, messageId: string, dto: ReactionDto) {
    return this.prisma.reaction.upsert({
      where: { emoji_userId_messageId: { emoji: dto.emoji, userId, messageId } },
      update: {},
      create: { emoji: dto.emoji, userId, messageId },
    });
  }

  pin(id: string, dto: PinDto) {
    return this.prisma.message.update({ where: { id }, data: { isPinned: dto.isPinned } });
  }

  direct(userId: string, recipientId: string) {
    return this.prisma.message.findMany({
      where: {
        isDeleted: false,
        OR: [
          { authorId: userId, recipientId },
          { authorId: recipientId, recipientId: userId },
        ],
      },
      include: messageInclude,
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  }

  private async getOwned(userId: string, id: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) throw new NotFoundException('Message introuvable.');
    if (message.authorId !== userId) throw new ForbiddenException('Action refusee.');
    return message;
  }
}
