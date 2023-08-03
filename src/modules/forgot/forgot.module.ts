import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FORGOT_PASSWORDS_COLLECTION_NAME, ForgotSchema } from './forgot.schema';
import { ForgotService } from './forgot.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FORGOT_PASSWORDS_COLLECTION_NAME,
        schema: ForgotSchema,
      },
    ]),
  ],
  providers: [ForgotService],
  exports: [ForgotService],
})
export class ForgotModule {}
