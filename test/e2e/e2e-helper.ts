import { AppModule } from '#/app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';
import * as process from 'node:process';
import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';

export async function startApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  const moodleWrapper = new MoodleWrapper(
    new FetchWrapper(process.env.LMS_URL!, new Logger()),
    'token',
  );
  process.env.LMS_TOKEN = await moodleWrapper.login(
    'sga',
    'Universae.123',
    'create_course',
  );

  return app;
}
