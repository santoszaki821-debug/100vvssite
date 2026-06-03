import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';

type SocketUser = { sub: string; username: string; role: string };
const corsOrigin = (process.env.CORS_ORIGIN ?? 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim());

@WebSocketGateway({ cors: { origin: corsOrigin, credentials: true } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly messages: MessagesService,
    private readonly jwt: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || client.handshake.headers.authorization?.toString().replace('Bearer ', '');
    try {
      const user = await this.jwt.verifyAsync<SocketUser>(token);
      client.data.user = user;
      client.join(`user:${user.sub}`);
      this.server.emit('presence:update', { userId: user.sub, online: true });
    } catch {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('channel:join')
  joinChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    client.join(`channel:${channelId}`);
  }

  @SubscribeMessage('message:create')
  async create(@ConnectedSocket() client: Socket, @MessageBody() body: { channelId?: string; recipientId?: string; body: string; imageUrl?: string; gifUrl?: string; replyToId?: string }) {
    const user = client.data.user as SocketUser;
    const message = await this.messages.create(user.sub, body);
    if (message.channelId) this.server.to(`channel:${message.channelId}`).emit('message:new', message);
    if (message.recipientId) this.server.to(`user:${message.recipientId}`).to(`user:${user.sub}`).emit('message:new', message);
    return message;
  }
}
