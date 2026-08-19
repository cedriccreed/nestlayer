import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

type RequestWithRole = {
  user?: {
    role?: Role;
  };
};

// Authentication (JwtAuthGuard) answers "who are you?" and must run first
// so request.user exists. Authorization (this guard) answers "what can you
// do?" by comparing that user to @Roles() metadata.
//
// Reflector is Nest's API for reading SetMetadata values. We need it
// because the decorator and the guard are separate classes — metadata is
// the only link between @Roles(Role.ADMIN) and this canActivate() check.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() on the handler or controller → any authenticated caller
    // (or even an unauthenticated one if JwtAuthGuard is missing) may pass.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithRole>();
    const userRole = request.user?.role;
    if (!userRole) {
      return false;
    }

    return requiredRoles.includes(userRole);
  }
}
