import { v4 as uuid } from 'uuid';
import { Logger } from '@nestjs/common';
import datasource from '#config/ormconfig';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';

export async function createAdminUser(
  logger: Logger,
  passwordEncoder: PasswordEncoder,
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
    'primer apelido',
    'segundo apellido',
    new IdentityDocument({
      identityDocumentType: IdentityDocumentType.DNI,
      identityDocumentNumber: '65580242C',
    }),
  );

  await adminUserRepository.save(newAdminUser);

  logger.log('Admin user created');

  return;
}
