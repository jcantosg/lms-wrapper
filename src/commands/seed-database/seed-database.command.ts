import { NestFactory } from '@nestjs/core';
import datasource from '#config/ormconfig';
import { Logger } from '@nestjs/common';
import { AppModule } from '#/app.module';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { seedCountries } from '#commands/country/seed-countries';
import { seedBusinessUnits } from '#commands/business-unit/seed-business-units';
import { createAdminUser } from '#commands/admin-user/create-default-admin-user';
import { ConfigService } from '@nestjs/config';
import { seedAdminUsers } from '#commands/admin-user/seed-admin-users';
import { seedEdaeUsers } from '#commands/edae-user/seed-edae-users';
import { seedAcademicPeriods } from '#commands/academic-period/seed-academic-periods';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Import data example command');
  app.useLogger(logger);

  const passwordEncoder: PasswordEncoder = app.get(PasswordEncoder);
  const configService = await app.resolve(ConfigService);
  const email = configService.get('ADMIN_USER_EMAIL');
  const password = configService.get('ADMIN_USER_PASSWORD');

  await seedCountries(logger);
  await createAdminUser(logger, passwordEncoder, email, password);
  await seedBusinessUnits(logger);
  await seedAdminUsers(logger, passwordEncoder);
  await seedEdaeUsers(logger);
  await seedAcademicPeriods(logger);

  await datasource.destroy();
  await app.close();
}

bootstrap();
