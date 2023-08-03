import { NestFactory } from '@nestjs/core';
import yargs from 'yargs/yargs';
import { SeedModule } from './seed.module';
import { SuperAdminSeedService } from './super-admin/super-admins-seed.service';

const argv = yargs(process.argv.slice(2))
  .options({
    email: { type: 'string', demandOption: true },
    password: { type: 'string', demandOption: true },
  })
  .parseSync();

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(SuperAdminSeedService).run(argv.email, argv.password);

  await app.close();
};

void runSeed();
