import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';

@Injectable()
export class AdminUserPostgresRepository implements AdminUserRepository {
  constructor(
    @InjectRepository(adminUserSchema)
    private readonly repository: Repository<AdminUser>,
  ) {}

  async get(id: string): Promise<AdminUser | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async getByEmail(email: string): Promise<AdminUser | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async save(adminUser: AdminUser): Promise<void> {
    await this.repository.save(adminUser);
  }

  async exists(id: string): Promise<boolean> {
    return !!(await this.repository.findOne({ where: { id } }));
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!(await this.repository.findOne({ where: { email } }));
  }
}
