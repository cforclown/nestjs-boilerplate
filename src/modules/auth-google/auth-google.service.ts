import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { AllConfigType } from 'src/config/config.type';
import i18n from 'src/i18n';

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor(private configService: ConfigService<AllConfigType>) {
    this.google = new OAuth2Client(
      configService.get('google.clientId', { infer: true }),
      configService.get('google.clientSecret', { infer: true }),
    );
  }

  async getProfileByToken(loginDto: AuthGoogleLoginDto): Promise<string> {
    const ticket = await this.google.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [this.configService.getOrThrow('google.clientId', { infer: true })],
    });

    const data = ticket.getPayload();

    if (!data?.email) {
      throw new UnprocessableEntityException(i18n?.t('common.wrongToken'));
    }

    return data.email;
  }
}
