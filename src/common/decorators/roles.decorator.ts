import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

// SetMetadata stores extra data on the route handler (or class). It does not
// enforce anything by itself — it only labels the endpoint, e.g.
// @Roles(Role.ADMIN) → metadata { roles: ['ADMIN'] }.
//
// RolesGuard later reads that label with Reflector and decides whether
// request.user.role is allowed. Decorators declare policy; guards enforce it.
export const Roles = (...roles: Role[]): CustomDecorator =>
  SetMetadata(ROLES_KEY, roles);
