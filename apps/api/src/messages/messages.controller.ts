import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser, RequestUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateMessageDto, PinDto, ReactionDto, UpdateMessageDto } from './dto';
import { MessagesService } from './messages.service';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get('channels')
  channels() {
    return this.messages.channels();
  }

  @Get('channels/:channelId')
  history(@Param('channelId') channelId: string) {
    return this.messages.history(channelId);
  }

  @Get('direct/:recipientId')
  direct(@CurrentUser() user: RequestUser, @Param('recipientId') recipientId: string) {
    return this.messages.direct(user.sub, recipientId);
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateMessageDto) {
    return this.messages.create(user.sub, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.messages.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.messages.remove(user.sub, id, user.role);
  }

  @Post(':id/reactions')
  react(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: ReactionDto) {
    return this.messages.react(user.sub, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MODERATOR, Role.ADMIN, Role.FOUNDER)
  @Patch(':id/pin')
  pin(@Param('id') id: string, @Body() dto: PinDto) {
    return this.messages.pin(id, dto);
  }
}
