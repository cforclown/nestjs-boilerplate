import { Test, TestingModule } from '@nestjs/testing';
import { AdminInvitationsService } from './admin-invitation.service';

describe('AdminInvitationsService', () => {
  let service: AdminInvitationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminInvitationsService],
    }).compile();

    service = module.get<AdminInvitationsService>(AdminInvitationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
