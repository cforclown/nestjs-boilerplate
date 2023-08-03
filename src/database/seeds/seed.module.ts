import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import { SuperAdminSeedModule } from './super-admin/super-admins-seed.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AllConfigType } from '@config/config.type';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        uri: `mongodb://${configService.get('database.username', {
          infer: true,
        })}:${configService.get('database.password', { infer: true })}@${configService.get('database.host', {
          infer: true,
        })}:${configService.get('database.port', { infer: true })}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: configService.get('database.name', { infer: true }),
      }),
    }),
    SuperAdminSeedModule,
  ],
})
export class SeedModule {}
