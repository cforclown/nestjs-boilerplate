import { Module } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { ConfigModule } from '@nestjs/config';
import { AuthGoogleController } from './auth-google.controller';
import { AuthModule } from '@modules/auth/auth.module';
import { AdminsModule } from '@modules/admins/admins.module';
import { SessionsModule } from '@modules/session/sessions.module';

@Module({
  imports: [ConfigModule, AuthModule, AdminsModule, SessionsModule],
  providers: [AuthGoogleService],
  exports: [AuthGoogleService],
  controllers: [AuthGoogleController],
})
export class AuthGoogleModule {}
