import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdminUserRepository } from '#admin-user/domain/repository/admin-user.repository';
import {
  AdminUser,
  AdminUserStatus,
} from '#admin-user/domain/entity/admin-user.entity';
import { adminUserSchema } from '#admin-user/infrastructure/config/schema/admin-user.schema';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

@Injectable()
export class AdminUserPostgresRepository
  extends TypeOrmRepository<AdminUser>
  implements AdminUserRepository
{
  constructor(
    @InjectRepository(adminUserSchema)
    private readonly repository: Repository<AdminUser>,
  ) {
    super();
  }

  async get(id: string): Promise<AdminUser | null> {
    return await this.repository.findOne({
      where: {
        id,
        status: Not(AdminUserStatus.DELETED),
      },
      relations: { businessUnits: { country: true } },
    });
  }

  async getByEmail(email: string): Promise<AdminUser | null> {
    return await this.repository.findOne({
      where: { email, status: Not(AdminUserStatus.DELETED) },
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
      surname: adminUser.surname,
      surname2: adminUser.surname2,
      identityDocument: adminUser.identityDocument,
      status: adminUser.status,
    });
  }

  async exists(id: string): Promise<boolean> {
    return !!(await this.repository.findOne({ where: { id } }));
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!(await this.repository.findOne({ where: { email } }));
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
  ): Promise<number> {
    const aliasQuery = 'admin';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'business_units',
    );

    queryBuilder.where(`${aliasQuery}.status != 'deleted'`);

    const baseRepository = await this.filterBusinessUnits(
      queryBuilder,
      adminUserBusinessUnits,
    );

    await baseRepository.convertCriteriaToQueryBuilder(
      criteria,
      queryBuilder,
      aliasQuery,
    );

    const count = await baseRepository
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getCount(queryBuilder);

    return count;
  }

  async matching(
    criteria: Criteria,
    adminUserBusinessUnits?: BusinessUnit[],
  ): Promise<AdminUser[]> {
    const aliasQuery = 'admin';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'business_units',
    );
    queryBuilder.where(`${aliasQuery}.status != 'deleted'`);

    const baseRepository = await this.filterBusinessUnits(
      queryBuilder,
      adminUserBusinessUnits,
    );

    await baseRepository.convertCriteriaToQueryBuilder(
      criteria,
      queryBuilder,
      aliasQuery,
    );

    const result = await baseRepository
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getMany(queryBuilder);

    return adminUserBusinessUnits
      ? await this.cleanBusinessUnits(result, adminUserBusinessUnits)
      : result;
  }

  private async cleanBusinessUnits(
    result: AdminUser[],
    adminUserBusinessUnits: BusinessUnit[],
  ): Promise<AdminUser[]> {
    const users = await this.repository.find({
      where: { id: In(result.map((pre) => pre.id)) },
      relations: { businessUnits: true },
    });

    users.forEach((user) => {
      user.businessUnits = user.businessUnits.filter((bu) =>
        adminUserBusinessUnits.find((adminBu) => adminBu.id === bu.id),
      );
    });

    return users;
  }

  async getByAdminUser(
    adminUserId: string,
    adminUserBusinessUnits: string[],
  ): Promise<AdminUser | null> {
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );

    const queryBuilder = this.repository.createQueryBuilder('adminUser');

    queryBuilder.leftJoinAndSelect('adminUser.businessUnits', 'businessUnit');

    return await queryBuilder
      .where('adminUser.id = :id', { id: adminUserId })
      .andWhere('businessUnit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }
}
