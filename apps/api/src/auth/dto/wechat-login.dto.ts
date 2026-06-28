import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class WechatLoginDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
