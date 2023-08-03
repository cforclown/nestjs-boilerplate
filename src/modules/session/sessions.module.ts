import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SESSIONS_COLLECTION_NAME, SessionSchema } from './sessions.schema';
import { SessionsService } from './session.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SESSIONS_COLLECTION_NAME,
        schema: SessionSchema,
      },
    ]),
  ],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
