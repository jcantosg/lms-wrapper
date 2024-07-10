import { AppModule } from '#/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

export async function startApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
}
