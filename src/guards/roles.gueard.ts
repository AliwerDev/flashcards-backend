// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoleEnum } from 'src/models/user.scheme';

@Injectable()
export class Guard implements CanActivate {
  constructor(private readonly roles: RoleEnum[]) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!this.roles || this.roles.length === 0) {
      return true;
    }

    return this.roles.some((role) => user.roles?.includes(role));
  }
}

export function RolesGuard(...roles: RoleEnum[]): CanActivate {
  return new Guard(roles);
}
