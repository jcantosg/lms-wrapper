import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';
import supertest from 'supertest';
import { DataSource } from 'typeorm';
import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { HttpServer } from '@nestjs/common';

export async function login(httpServer: any, email: string, password: string) {
  const loginResponse = await supertest(httpServer).post('/auth/login').send({
    username: email,
    password: password,
  });

  return loginResponse.body.accessToken;
}

export async function createAdminUser(
  datasource: DataSource,
  id: string,
  email: string,
  password: string,
  roles: AdminUserRoles[],
  businessUnits: BusinessUnit[] = [],
  name?: string,
  surname?: string,
): Promise<AdminUser> {
  const passwordEncoder = new BCryptPasswordEncoder();
  const userRepository = datasource.getRepository(adminUserSchema);

  return await userRepository.save(
    AdminUser.create(
      id,
      email,
      await passwordEncoder.encodePassword(password),
      roles,
      name ?? 'name',
      'avatar',
      businessUnits,
      surname ?? 'surname',
      'surname2',
      new IdentityDocument({
        identityDocumentType: IdentityDocumentType.DNI,
        identityDocumentNumber: '74700994F',
      }),
    ),
  );
}

export async function removeAdminUser(
  datasource: DataSource,
  adminUser: AdminUser,
) {
  const userRepository = datasource.getRepository(adminUserSchema);
  const user = await userRepository.findOne({ where: { id: adminUser.id } });
  if (user) {
    await userRepository.delete(user.id);
  }
}

export async function loginStudent(
  httpServer: HttpServer,
  email: string,
  password: string,
): Promise<string> {
  const loginResponse = await supertest(httpServer)
    .post('/student-360/login')
    .send({
      username: email,
      password: password,
    });

  return loginResponse.body.accessToken;
}
