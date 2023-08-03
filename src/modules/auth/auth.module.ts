import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { AdminsModule } from '@modules/admins/admins.module';
import { ForgotModule } from '@modules/forgot/forgot.module';
import { MailModule } from '@modules/mail/mail.module';
import { IsExist } from '@utils/validators/is-exists.validator';
import { IsNotExist } from '@utils/validators/is-not-exists.validator';
import { SessionsModule } from '@modules/session/sessions.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AdminInvitationsModule } from '@modules/admin-invitations/admin-invitation.module';

@Module({
  imports: [
    AdminsModule,
    ForgotModule,
    SessionsModule,
    PassportModule,
    MailModule,
    AdminInvitationsModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [IsExist, IsNotExist, AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
  exports: [AuthService],
})
export class AuthModule {}
