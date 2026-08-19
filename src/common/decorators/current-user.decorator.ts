import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// A custom parameter decorator is a small NestJS helper built with
// createParamDecorator. It runs when Nest binds a controller argument, the
// same way @Body() or @Param() do, and returns the value injected into
// that parameter.
//
// We use @CurrentUser() instead of @Req() req.user so controllers stay
// free of Express types and of the Passport request shape. Tests can mock
// the decorator result, and if we later move user onto a different key,
// only this file changes.
//
// After JwtAuthGuard (or JwtRefreshGuard) succeeds, Passport writes the
// object returned by Strategy.validate() onto request.user. This decorator
// reads that field from the HTTP context.

type RequestWithUser = {
  user: unknown;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
