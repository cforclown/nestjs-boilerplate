import { Session } from '@modules/session/sessions.schema';

export type JwtRefreshPayloadType = {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
