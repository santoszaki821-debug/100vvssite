import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendsService } from './friends.service';

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friends: FriendsService) {}

  @Get()
  list(@CurrentUser() user: RequestUser) {
    return this.friends.list(user.sub);
  }

  @Post(':receiverId')
  add(@CurrentUser() user: RequestUser, @Param('receiverId') receiverId: string) {
    return this.friends.add(user.sub, receiverId);
  }

  @Patch(':id/accept')
  accept(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.friends.accept(user.sub, id);
  }

  @Delete(':id/refuse')
  refuse(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.friends.refuse(user.sub, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.friends.remove(user.sub, id);
  }

  @Post(':receiverId/block')
  block(@CurrentUser() user: RequestUser, @Param('receiverId') receiverId: string) {
    return this.friends.block(user.sub, receiverId);
  }

  @Delete(':id/unblock')
  unblock(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.friends.unblock(user.sub, id);
  }
}
