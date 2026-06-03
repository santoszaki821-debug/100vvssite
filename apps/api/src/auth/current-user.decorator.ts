import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type RequestUser = {
  sub: string;
  username: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN' | 'FOUNDER';
};

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): RequestUser => {
  const request = ctx.switchToHttp().getRequest<{ user: RequestUser }>();
  return request.user;
});
