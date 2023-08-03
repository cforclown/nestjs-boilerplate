import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@modules/roles/roles.decorator';
import { RolesGuard } from '@modules/roles/roles.guard';
import { NullableType } from '@utils/types/nullable.type';
import { Admin } from './admin.schema';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { InviteAdminDto } from './dto/invite-admin.dto';
import { ChangeAdminRoleDto } from './dto/change-admin-role.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Admins')
@Controller({
  path: 'admins',
  version: '1',
})
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Roles([{ admins: 'create' }])
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminsService.create(createAdminDto);
  }

  @Roles([{ admins: 'read' }])
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Admin[]> {
    if (limit > 50) {
      limit = 50;
    }

    return this.adminsService.findWithPagination({ page, limit });
  }

  @Roles([{ admins: 'read' }])
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: string): Promise<Admin> {
    const admin = await this.adminsService.findOne({ id });
    if (!admin) {
      throw new NotFoundException();
    }

    return admin;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateProfile(@Request() request, @Body() updateProfileDto: UpdateAdminProfileDto): Promise<NullableType<Admin>> {
    return this.adminsService.update(request.user.id, updateProfileDto);
  }

  @Roles([{ admins: 'update' }])
  @Post()
  @HttpCode(HttpStatus.OK)
  changeRole(@Body() payload: ChangeAdminRoleDto): Promise<NullableType<Admin>> {
    return this.adminsService.changeRole(payload);
  }

  @Roles([{ admins: 'create' }])
  @Post()
  @HttpCode(HttpStatus.OK)
  invite(@Body() payload: InviteAdminDto): Promise<InviteAdminDto> {
    return this.adminsService.inviteAdmin(payload);
  }

  @Roles([{ admins: 'delete' }])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.adminsService.delete(id);
  }
}
