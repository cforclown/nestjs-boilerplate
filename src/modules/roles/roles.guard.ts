import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, RoleCapabilityCommonActionsType, RoleCapabilityType } from './role.schema';
import { RolesService } from './roles.service';
import { JwtPayloadType } from '@modules/auth/strategies/types/jwt-payload.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedActions = this.reflector.getAllAndOverride<
      { [K in RoleCapabilityType]?: RoleCapabilityCommonActionsType }[]
    >('allowedActions', [context.getClass(), context.getHandler()]);
    const req = context.switchToHttp().getRequest();
    if (!req.user) {
      return false;
    }

    const role = await this.rolesService.findById((req.user as JwtPayloadType).roleId);
    if (!role) {
      return false;
    }

    const { capabilities: userCapabilities }: Role = role;
    for (const allowedAction of allowedActions) {
      const [[capabilitType, action]] = Object.entries(allowedAction);
      if (userCapabilities[capabilitType][action]) {
        return true;
      }
    }

    return false;
  }
}
