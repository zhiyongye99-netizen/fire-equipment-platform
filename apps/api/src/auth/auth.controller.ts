import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { WechatLoginDto } from "./dto/wechat-login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("wechat")
  async wechatLogin(@Body() dto: WechatLoginDto): Promise<{
    data: {
      token: string;
      user: { id: string; openid: string; role: string; nickname: string | null };
    };
  }> {
    const result = await this.authService.wechatLogin(dto);
    return { data: result };
  }
}
