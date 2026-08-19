import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Runs the 'jwt-refresh' strategy so /auth/refresh accepts a refresh JWT
// instead of the short-lived access token.
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
