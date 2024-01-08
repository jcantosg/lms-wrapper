import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { BCryptPasswordEncoder } from '#admin-user/infrastructure/service/bcrypt-password-encoder.service';
import supertest from 'supertest';
import { DataSource } from 'typeorm';

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
): Promise<AdminUser> {
  const passwordEncoder = new BCryptPasswordEncoder();
  const userRepository = datasource.getRepository(adminUserSchema);

  return await userRepository.save(
    AdminUser.create(
      id,
      email,
      await passwordEncoder.encodePassword(password),
      roles,
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
