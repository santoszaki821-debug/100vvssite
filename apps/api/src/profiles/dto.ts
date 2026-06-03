import { ProfileTheme } from '@prisma/client';
import { IsEnum, IsHexColor, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(3, 24)
  @Matches(/^[a-zA-Z0-9_.-]+$/)
  displayName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 300)
  @Matches(/^(\/|https?:\/\/)/)
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @Length(1, 300)
  @Matches(/^(\/|https?:\/\/)/)
  bannerUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 280)
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  status?: string;

  @IsOptional()
  @IsHexColor()
  nameColor?: string;

  @IsOptional()
  @IsString()
  messageFrame?: string;

  @IsOptional()
  @IsString()
  profileStyle?: string;

  @IsOptional()
  @IsEnum(ProfileTheme)
  theme?: ProfileTheme;
}
