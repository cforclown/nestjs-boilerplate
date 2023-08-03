import { Body, Controller, HttpCode, HttpStatus, Post, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@modules/auth/auth.service';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { TokenResponse } from '@modules/auth/types/login-response.type';
import { AdminsService } from '@modules/admins/admins.service';
import { SessionsService } from '@modules/session/session.service';
import i18n from 'src/i18n';

@ApiTags('Auth')
@Controller({
  path: 'auth/google',
  version: '1',
})
export class AuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
    private adminsService: AdminsService,
    private sessionsService: SessionsService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthGoogleLoginDto): Promise<TokenResponse> {
    const email = await this.authGoogleService.getProfileByToken(loginDto);
    const admin = await this.adminsService.findOne({ email });
    if (!admin) {
      throw new UnprocessableEntityException(i18n?.t('common.wrongToken'));
    }
    const session = await this.sessionsService.create({ admin });
    const { token, refreshToken, tokenExpires } = await this.authService.generateTokenData({
      adminId: admin.id,
      roleId: admin.role.id,
      sessionId: session.id,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
      admin,
    };
  }
}
