import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver } from 'nestjs-i18n';
import path from 'path';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './config/mail.config';
import fileConfig from './config/file.config';
import googleConfig from './config/google.config';
import { AllConfigType } from './config/config.type';
import { AdminsModule } from '@modules/admins/admins.module';
import { FilesModule } from '@modules/files/files.module';
import { AuthModule } from '@modules/auth/auth.module';
import { AuthGoogleModule } from '@modules/auth-google/auth-google.module';
import { ForgotModule } from '@modules/forgot/forgot.module';
import { MailModule } from '@modules/mail/mail.module';
import { HomeModule } from '@modules/home/home.module';
import { SessionsModule } from '@modules/session/sessions.module';
import { MailerModule } from '@modules/mailer/mailer.module';
import { RolesModule } from './modules/roles/roles.module';
import { AdminInvitationsModule } from './modules/admin-invitations/admin-invitation.module';
import { GlobalModule } from './global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig, googleConfig],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        uri: `mongodb://${configService.get('database.username', {
          infer: true,
        })}:${configService.get('database.password', { infer: true })}@${configService.get('database.host', {
          infer: true,
        })}:${configService.get('database.port', { infer: true })}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: configService.get('database.name', { infer: true }),
      }),
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    GlobalModule,
    AdminsModule,
    FilesModule,
    AuthModule,
    AuthGoogleModule,
    ForgotModule,
    SessionsModule,
    MailModule,
    MailerModule,
    HomeModule,
    RolesModule,
    AdminInvitationsModule,
  ],
})
export class AppModule {}
