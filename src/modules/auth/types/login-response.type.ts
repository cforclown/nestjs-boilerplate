import { Admin } from '@modules/admins/admin.schema';

export type TokenResponse = Readonly<{
  admin: Admin;
  token: string;
  refreshToken: string;
  tokenExpires: number;
}>;
