import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from '../role.schema';

export class CreateRoleDto {
  @ApiProperty({ example: 'basic' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'role description' })
  @IsOptional()
  desc: string;

  @ApiProperty({
    example: {
      masterData: {
        read: true,
        create: false,
        update: false,
        delete: false,
      },
    },
  })
  @IsOptional()
  capabilities: Role['capabilities'];
}
