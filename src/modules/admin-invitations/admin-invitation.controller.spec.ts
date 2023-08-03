import { Test, TestingModule } from '@nestjs/testing';
import { AdminInvitationsController } from './admin-invitation.controller';
import { AdminInvitationsService } from './admin-invitation.service';

describe('AdminInvitationsController', () => {
  let controller: AdminInvitationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminInvitationsController],
      providers: [AdminInvitationsService],
    }).compile();

    controller = module.get<AdminInvitationsController>(AdminInvitationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
