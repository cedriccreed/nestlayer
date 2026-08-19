import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService, AuthTokens, SafeUser } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtPayload } from './strategies/jwt.strategy';
import { JwtRefreshPayload } from './strategies/jwt-refresh.strategy';

type AuthedRequest = Request & { user: JwtPayload };
type RefreshRequest = Request & { user: JwtRefreshPayload };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Public sign-up. ValidationPipe applies RegisterDto rules first.
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<SafeUser> {
    return this.authService.register(dto);
  }

  // Public login. Returns access + refresh JWTs (201 is wrong here: nothing
  // new is persisted besides rotating the refresh hash).
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<AuthTokens> {
    return this.authService.login(dto);
  }

  // Requires a valid access token. Drops the stored refresh hash so the
  // session cannot be renewed.
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: AuthedRequest): Promise<{ message: string }> {
    return this.authService.logout(req.user.sub);
  }

  // Requires a valid refresh token (not the access token). Issues a new pair.
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  refreshTokens(@Req() req: RefreshRequest): Promise<AuthTokens> {
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }
}
