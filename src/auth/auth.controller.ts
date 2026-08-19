import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

// @ApiTags groups these routes under "Auth" in the Swagger sidebar.
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Public sign-up. ValidationPipe applies RegisterDto rules first.
  // @ApiOperation is the short title in Swagger; @ApiResponse lists
  // status codes the client should handle.
  @Post('register')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  register(@Body() dto: RegisterDto): Promise<SafeUser> {
    return this.authService.register(dto);
  }

  // Public login. Returns access + refresh JWTs (201 is wrong here: nothing
  // new is persisted besides rotating the refresh hash).
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in and receive access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Tokens issued' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto): Promise<AuthTokens> {
    return this.authService.login(dto);
  }

  // Requires a valid access token. Drops the stored refresh hash so the
  // session cannot be renewed.
  // @ApiBearerAuth adds the lock icon and Authorize button for this route.
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke the current refresh session' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  logout(@Req() req: AuthedRequest): Promise<{ message: string }> {
    return this.authService.logout(req.user.sub);
  }

  // Requires a valid refresh token (not the access token). Issues a new pair.
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rotate access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'New token pair issued' })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid refresh token',
  })
  refreshTokens(@Req() req: RefreshRequest): Promise<AuthTokens> {
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }
}
