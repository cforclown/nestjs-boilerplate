import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '@modules/admins/admin.schema';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AdminsService } from '@modules/admins/admins.service';
import { ForgotService } from '@modules/forgot/forgot.service';
import { MailService } from '@modules/mail/mail.service';
import { TokenResponse } from './types/login-response.type';
import { AllConfigType } from 'src/config/config.type';
import { SessionsService } from '@modules/session/session.service';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { AuthAcceptInvitationDto } from './dto/auth-accept-invitation.dto';
import { AdminInvitationsService } from '@modules/admin-invitations/admin-invitation.service';
import { generateHash } from '@utils/generate-hash';
import i18n from 'src/i18n';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminInvitationsService: AdminInvitationsService,
    private adminsService: AdminsService,
    private forgotService: ForgotService,
    private sessionsService: SessionsService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<TokenResponse> {
    const admin = await this.adminsService.findOne({ email: loginDto.email }, { json: true });
    if (!admin?.password || !(await bcrypt.compare(loginDto.password, admin.password))) {
      throw new UnprocessableEntityException(i18n?.t('common.incorrectPassword'));
    }

    const session = await this.sessionsService.create({ admin });

    const { token, refreshToken, tokenExpires } = await this.generateTokenData({
      adminId: admin.id,
      roleId: admin.role.id,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      admin,
    };
  }

  async acceptInvitation({ invitationId, fullname, password }: AuthAcceptInvitationDto): Promise<TokenResponse> {
    const invitation = await this.adminInvitationsService.findOne({ invitationId });
    if (!invitation) {
      throw new NotFoundException(i18n?.t(`common.invitationNotValid`));
    }

    const admin = await this.adminsService.create({
      email: invitation.email,
      password: password,
      fullname: fullname,
      role: invitation.role.id,
    });

    const session = await this.sessionsService.create({ admin });

    const { token, refreshToken, tokenExpires } = await this.generateTokenData({
      adminId: admin.id,
      roleId: admin.role.id,
      sessionId: session.id,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
      admin: admin,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const admin = await this.adminsService.findOne({ email });

    if (!admin) {
      throw new UnprocessableEntityException(i18n?.t('common.emailNotExists'));
    }

    const hash = generateHash();
    await this.forgotService.create({ admin, hash });

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotService.findOne({ hash });
    if (!forgot) {
      throw new UnprocessableEntityException(i18n?.t(`reset-password.hashNotFound`));
    }

    const admin = await this.adminsService.update(forgot.admin.id, { password: password });
    if (!admin) {
      throw new UnprocessableEntityException(i18n?.t(`reset-password.hashNotFound`));
    }

    await Promise.all([
      this.sessionsService.deleteByAdminId(admin.id), // logout for all device for this admin
      this.forgotService.delete(forgot.id),
    ]);
  }

  async me(adminJwtPayload: JwtPayloadType): Promise<Admin> {
    const admin = await this.adminsService.findOne({ id: adminJwtPayload.adminId });
    if (!admin) {
      throw new UnprocessableEntityException(i18n?.t('common.unexpected'));
    }

    return admin;
  }

  async update(adminJwtPayload: JwtPayloadType, updateDto: AuthUpdateDto): Promise<Admin> {
    if (updateDto.password) {
      if (updateDto.oldPassword) {
        const currentAdmin = await this.adminsService.findOne({ id: adminJwtPayload.adminId });
        if (!currentAdmin) {
          throw new UnprocessableEntityException(i18n?.t(`common.adminNotFound`));
        }

        const isValidOldPassword = await bcrypt.compare(updateDto.oldPassword, currentAdmin.password);
        if (!isValidOldPassword) {
          throw new UnprocessableEntityException(i18n?.t(`common.incorrectOldPassword`));
        } else {
          await this.sessionsService.deleteByAdminId(currentAdmin.id, adminJwtPayload.sessionId);
        }
      } else {
        throw new UnprocessableEntityException(i18n?.t(`common.missingOldPassword`));
      }
    }

    const admin = await this.adminsService.update(adminJwtPayload.adminId, updateDto);
    if (!admin) {
      throw new UnprocessableEntityException(i18n?.t(`common.adminNotFound`));
    }

    return admin;
  }

  async refreshToken(data: Pick<JwtRefreshPayloadType, 'sessionId'>): Promise<TokenResponse> {
    const session = await this.sessionsService.findOne({ _id: data.sessionId });
    if (!session) {
      throw new UnauthorizedException();
    }

    const { token, refreshToken, tokenExpires } = await this.generateTokenData({
      adminId: session.admin.id,
      roleId: session.admin.role.id,
      sessionId: session.id,
    });

    return {
      admin: session.admin,
      token,
      refreshToken,
      tokenExpires,
    };
  }

  logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>): Promise<void> {
    return this.sessionsService.deleteById(data.sessionId);
  }

  async generateTokenData({ adminId, roleId, sessionId }: { adminId: string; roleId: string; sessionId: string }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', { infer: true });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        { adminId, roleId, sessionId },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        { sessionId: sessionId },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', { infer: true }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', { infer: true }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
