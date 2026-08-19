import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Runs the 'jwt' Passport strategy (access token in Authorization: Bearer).
// Attach to any route that requires a logged-in user.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
