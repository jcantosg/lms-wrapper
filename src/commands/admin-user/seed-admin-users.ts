import datasource from '#config/ormconfig';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { PasswordEncoder } from '#admin-user/domain/service/password-encoder.service';
import { adminUsers } from './admin-users';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { Logger } from '@nestjs/common';

export async function seedAdminUsers(
  logger: Logger,
  passwordEncoder: PasswordEncoder,
) {
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const adminUserRepository = datasource.getRepository(AdminUser);
  const allBusinessUnits = await businessUnitRepository.find();

  const superAdminUser = await adminUserRepository.findOne({
    where: { email: 'sga@universae.com' },
  });
  await adminUserRepository.save({
    id: superAdminUser?.id,
    businessUnits: allBusinessUnits,
  });

  for await (const adminUser of adminUsers) {
    const user = AdminUser.create(
      adminUser.id,
      adminUser.email,
      await passwordEncoder.encodePassword('test123'),
      adminUser.roles,
      adminUser.name,
      '',
      allBusinessUnits.filter((bu) =>
        adminUser.businessUnits.includes(bu.code),
      ),
      'surname1',
      'surname2',
      new IdentityDocument({
        identityDocumentType: IdentityDocumentType.DNI,
        identityDocumentNumber: '74700994F',
      }),
    );

    await adminUserRepository.save(user);
  }

  logger.log('Admin users created');

  return;
}
