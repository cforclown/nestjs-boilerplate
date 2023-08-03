import { SetMetadata } from '@nestjs/common';
import { RoleCapabilityType, RoleCapabilityCommonActionsType } from './role.schema';

export const Roles = (allowedActions: { [K in RoleCapabilityType]?: RoleCapabilityCommonActionsType }[]) =>
  SetMetadata('allowedActions', allowedActions);
