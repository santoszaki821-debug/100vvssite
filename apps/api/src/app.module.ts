import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 80 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    MessagesModule,
    FriendsModule,
    AdminModule,
    ChatModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
