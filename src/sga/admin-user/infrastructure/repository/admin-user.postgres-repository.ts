import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { AdminUserRoles } from '#/sga/shared/domain/enum/admin-user-roles.enum';

@Injectable()
export class AdminUserPostgresRepository implements AdminUserRepository {
  constructor(
    @InjectRepository(adminUserSchema)
    private readonly repository: Repository<AdminUser>,
  ) {}

  async get(id: string): Promise<AdminUser | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { businessUnits: { country: true } },
    });
  }

  async getByEmail(email: string): Promise<AdminUser | null> {
    return await this.repository.findOne({
      where: { email },
      relations: { businessUnits: true },
    });
  }

  async save(adminUser: AdminUser): Promise<void> {
    await this.repository.save({
      id: adminUser.id,
      email: adminUser.email,
      password: adminUser.password,
      name: adminUser.name,
      roles: adminUser.roles,
      avatar: adminUser.avatar,
      createdAt: adminUser.createdAt,
      updatedAt: adminUser.updatedAt,
      businessUnits: adminUser.businessUnits,
    });
  }

  async exists(id: string): Promise<boolean> {
    return !!(await this.repository.findOne({ where: { id } }));
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!(await this.repository.findOne({ where: { email } }));
  }

  async getByRole(role: AdminUserRoles): Promise<AdminUser[]> {
    return await this.repository
      .createQueryBuilder('au')
      .leftJoinAndSelect('au.businessUnits', 'bu')
      .where(':role = ANY(au.roles)', { role: role })
      .getMany();
  }
}
