import { v4 as uuid } from 'uuid';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import datasource from '#config/ormconfig';
import { AppModule } from '#/app.module';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { ConfigService } from '@nestjs/config';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

async function createAdminUser(
  passwordEncoder: PasswordEncoder,
  logger: Logger,
  email: string,
  password: string,
) {
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const adminUserRepository = datasource.getRepository(AdminUser);

  if (!(await datasource.createQueryRunner().hasTable('admin_users'))) {
    logger.error('Table admin_users does not exists');

    return;
  }

  const existsAdminUser = await adminUserRepository.findOne({
    where: { email },
  });

  if (existsAdminUser) {
    logger.error('Admin user already exists');

    return;
  }

  const businessUnits = await businessUnitRepository.find();

  const newAdminUser: AdminUser = AdminUser.create(
    uuid(),
    email,
    await passwordEncoder.encodePassword(password),
    [AdminUserRoles.SUPERADMIN],
    'Super admin',
    '',
    businessUnits,
  );

  await adminUserRepository.save(newAdminUser);

  logger.log('Admin user created');

  return;
}

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

    datasource.destroy();
    await app.close();

    return;
  }

  await createAdminUser(passwordEncoder, logger, email, password);

  datasource.destroy();
  await app.close();
}

bootstrap();
