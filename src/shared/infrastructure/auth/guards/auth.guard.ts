
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }
  async canActivate(
    context: ExecutionContext,
  ) {

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromRequest(request);

    if (!token) throw new UnauthorizedException()

    try {

      const { sub } = await this.authService.verifyJwt(token);

      request.user = {
        id: sub
      }

    } catch (error) {

      throw new UnauthorizedException();

    }

    return true
  }

  extractTokenFromRequest(request: any) {
    const [, token] = request.headers.authorization.split(' ') ?? [];
    return token
  }
}


