import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthAcceptInvitationDto } from './dto/auth-accept-invitation.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenResponse } from './types/login-response.type';
import { Admin } from '@modules/admins/admin.schema';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('admin/email/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDTO: AuthEmailLoginDto): Promise<TokenResponse> {
    return this.service.validateLogin(loginDTO);
  }

  @Post('email/accept-invitation')
  @HttpCode(HttpStatus.OK)
  async acceptInvitation(@Body() payload: AuthAcceptInvitationDto): Promise<TokenResponse> {
    return this.service.acceptInvitation(payload);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(@Body() payload: AuthForgotPasswordDto): Promise<void> {
    return this.service.forgotPassword(payload.email);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() payload: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(payload.hash, payload.password);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public me(@Request() request): Promise<Admin> {
    return this.service.me(request.user);
  }

  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<TokenResponse> {
    return this.service.refreshToken(request.user.sessionId);
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    await this.service.logout({ sessionId: request.user.sessionId });
  }

  @ApiBearerAuth()
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public updateProfile(@Request() request, @Body() updateDto: AuthUpdateDto): Promise<Admin> {
    return this.service.update(request.user, updateDto);
  }
}
