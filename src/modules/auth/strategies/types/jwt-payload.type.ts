import { Session } from '@modules/session/sessions.schema';

export type JwtPayloadType = {
  adminId: string;
  roleId: string;
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
