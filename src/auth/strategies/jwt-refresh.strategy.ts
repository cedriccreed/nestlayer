import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.strategy';

export type JwtRefreshPayload = JwtPayload & { refreshToken: string };

// Access tokens are short-lived and signed with JWT_SECRET. Refresh tokens
// last longer and use JWT_REFRESH_SECRET so a leaked access token cannot be
// used to mint a new pair. This strategy also returns the raw token so
// AuthService can compare it to the hash stored on the user row.
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtRefreshPayload {
    const header = req.get('authorization');
    const refreshToken = header?.replace(/^Bearer\s+/i, '').trim();
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    return { sub: payload.sub, email: payload.email, refreshToken };
  }
}
