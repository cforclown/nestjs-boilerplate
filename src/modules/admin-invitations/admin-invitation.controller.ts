import { Controller, Get, Param, Delete } from '@nestjs/common';
import { AdminInvitationsService } from './admin-invitation.service';

@Controller('admin-invitations')
export class AdminInvitationsController {
  constructor(private readonly adminInvitationsService: AdminInvitationsService) {}

  @Get()
  findAll() {
    return this.adminInvitationsService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.adminInvitationsService.delete(id);
  }
}
