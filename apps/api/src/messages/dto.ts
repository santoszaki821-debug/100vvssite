import { IsBoolean, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  channelId?: string;

  @IsOptional()
  @IsString()
  recipientId?: string;

  @IsString()
  @Length(1, 2000)
  body!: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  gifUrl?: string;

  @IsOptional()
  @IsString()
  replyToId?: string;
}

export class UpdateMessageDto {
  @IsString()
  @Length(1, 2000)
  body!: string;
}

export class ReactionDto {
  @IsString()
  @Length(1, 16)
  emoji!: string;
}

export class PinDto {
  @IsBoolean()
  isPinned!: boolean;
}
