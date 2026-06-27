import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

/**
 * Auth Guard — 验证 Bearer JWT token
 * 从 Authorization header 取 token，验证后把 payload 挂到 request.user
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: unknown;
    }>();
    const auth = request.headers["authorization"];
    if (!auth?.startsWith("Bearer ")) throw new UnauthorizedException();
    try {
      const payload = jwt.verify(
        auth.slice(7),
        process.env.JWT_SECRET ?? "dev_secret_change_in_production",
      );
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
