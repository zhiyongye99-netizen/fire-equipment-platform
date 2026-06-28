import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { WechatLoginDto } from "./dto/wechat-login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async wechatLogin(dto: WechatLoginDto): Promise<{
    token: string;
    user: { id: string; openid: string; role: string; nickname: string | null };
  }> {
    const appId = process.env.WECHAT_APP_ID ?? "";
    const appSecret = process.env.WECHAT_APP_SECRET ?? "";

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${dto.code}&grant_type=authorization_code`;
    const res = await fetch(url);
    const data = (await res.json()) as {
      openid?: string;
      unionid?: string;
      errcode?: number;
      errmsg?: string;
    };

    if (!data.openid) {
      throw new UnauthorizedException("invalid wechat code");
    }

    const user = await this.prisma.user.upsert({
      where: { openid: data.openid },
      create: {
        openid: data.openid,
        unionid: data.unionid ?? null,
        nickname: dto.nickname ?? null,
        avatar_url: dto.avatarUrl ?? null,
        role: UserRole.firefighter,
      },
      update: {
        unionid: data.unionid ?? undefined,
        nickname: dto.nickname ?? undefined,
        avatar_url: dto.avatarUrl ?? undefined,
      },
    });

    const payload = { sub: user.id, openid: user.openid, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        openid: user.openid,
        role: user.role,
        nickname: user.nickname,
      },
    };
  }
}
