import { NestFactory } from '@nestjs/core';
import { AppModule } from '#/app.module';
import { Logger } from '@nestjs/common';
import { PasswordEncoder } from '#shared/domain/service/password-encoder.service';
import { ConfigService } from '@nestjs/config';
import datasource from '#config/ormconfig';
import { createAdminUser } from '#commands/admin-user/create-default-admin-user';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Create default admin user command');
  app.useLogger(logger);

  const passwordEncoder: PasswordEncoder = app.get(PasswordEncoder);

  const configService = await app.resolve(ConfigService);
  const email = configService.get('ADMIN_USER_EMAIL');
  const password = configService.get('ADMIN_USER_PASSWORD');

  if (!email || !password) {
    logger.error('Invalid admin user');

    await datasource.destroy();
    await app.close();

    return;
  }

  await createAdminUser(logger, passwordEncoder, email, password);

  await datasource.destroy();
  await app.close();
}

bootstrap();
