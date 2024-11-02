import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<Role[]>('roles', context.getHandler());
        if (!roles) {
            return true; // No roles specified, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user; // The user object from the request

        if (!user || !roles.includes(user.role)) {
            throw new ForbiddenException('You have no access to this feature');
        }
        return true; // Access granted
    }
}

