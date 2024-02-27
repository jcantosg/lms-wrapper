import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EdaeUser } from '../../domain/entity/edae-user.entity';
import { EdaeUserRepository } from '../../domain/repository/edae-user.repository';
import { edaeUserSchema } from '../config/schema/edae-user.schema';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

@Injectable()
export class EdaeUserPostgresRepository
  extends TypeOrmRepository<EdaeUser>
  implements EdaeUserRepository
{
  constructor(
    @InjectRepository(edaeUserSchema)
    private readonly repository: Repository<EdaeUser>,
  ) {
    super();
  }

  async save(edaeUser: EdaeUser): Promise<void> {
    await this.repository.save(edaeUser);
  }

  async get(id: string): Promise<EdaeUser | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<EdaeUser[]> {
    const aliasQuery = 'edaeUser';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'business_units',
    );
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.location`, 'country');
    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'manyToMany',
          adminUserBusinessUnits,
        );

    const result = await (
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      )
    )
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getMany(queryBuilder);

    return await this.cleanBusinessUnits(result, adminUserBusinessUnits);
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'edaeUser';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'business_units',
    );
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.location`, 'country');
    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'manyToMany',
          adminUserBusinessUnits,
        );

    return (
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      )
    )
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getCount(queryBuilder);
  }

  private async cleanBusinessUnits(
    result: EdaeUser[],
    adminUserBusinessUnits: BusinessUnit[],
  ) {
    const edaeUsers = await this.repository.find({
      where: { id: In(result.map((pre) => pre.id)) },
      relations: { businessUnits: { country: true } },
    });

    result.forEach((resultUser) => {
      const user = edaeUsers.find((user) => user.id === resultUser.id);
      resultUser.businessUnits = user!.businessUnits.filter((bu) =>
        adminUserBusinessUnits.find((adminBu) => adminBu.id === bu.id),
      );

      return resultUser;
    });

    return result;
  }
}
