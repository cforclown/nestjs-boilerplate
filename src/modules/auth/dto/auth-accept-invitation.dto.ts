import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthAcceptInvitationDto {
  @ApiProperty()
  @IsNotEmpty()
  invitationId: string;

  @ApiProperty()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
