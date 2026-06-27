import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

/**
 * Auth Guard 骨架
 * TODO: 正式版接入微信登录，验证 JWT/session token
 * 目前直接放行，方便开发调试
 */
@Injectable()
export class AuthGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(_context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // const request = context.switchToHttp().getRequest();
    // TODO: 验证 request.headers.authorization
    return true;
  }
}
