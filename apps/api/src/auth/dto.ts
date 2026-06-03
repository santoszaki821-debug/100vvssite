import { IsString, Length, Matches } from 'class-validator';

export class AuthDto {
  @IsString()
  @Length(3, 24)
  @Matches(/^[a-zA-Z0-9_.-]+$/)
  username!: string;

  @IsString()
  @Length(8, 128)
  password!: string;
}
