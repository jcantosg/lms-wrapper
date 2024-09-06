import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Title } from '#academic-offering/domain/entity/title.entity';
import { TitleRepository } from '#academic-offering/domain/repository/title.repository';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { titleSchema } from '#academic-offering/infrastructure/config/schema/title.schema';

export class TitlePostgresRepository
  extends TypeOrmRepository<Title>
  implements TitleRepository
{
  constructor(
    @InjectRepository(titleSchema)
    private readonly repository: Repository<Title>,
  ) {
    super();
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async save(title: Title): Promise<void> {
    await this.repository.save({
      id: title.id,
      name: title.name,
      officialCode: title.officialCode,
      officialTitle: title.officialTitle,
      officialProgram: title.officialProgram,
      businessUnit: title.businessUnit,
      createdAt: title.createdAt,
      updatedAt: title.updatedAt,
      createdBy: title.createdBy,
      updatedBy: title.updatedBy,
    });
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'title';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'oneToMany',
          adminUserBusinessUnits,
        );

    return await (
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

  async matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<Title[]> {
    const aliasQuery = 'title';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'oneToMany',
          adminUserBusinessUnits,
        );

    return await (
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      )
    )
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getMany(queryBuilder);
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnit`,
      'business_unit',
    );
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicPrograms`,
      'academic_program',
    );

    return queryBuilder;
  }

  async delete(title: Title): Promise<void> {
    await this.repository.delete(title.id);
  }

  async get(id: string): Promise<Title | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { businessUnit: true, academicPrograms: true },
    });
  }

  async getByAdminUser(
    titleId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Title | null> {
    if (isSuperAdmin) {
      return await this.get(titleId);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('title');

    return await queryBuilder
      .where('title.id = :id', { id: titleId })
      .andWhere('business_unit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async getByBusinessUnits(businessUnitIds: string[]): Promise<Title[]> {
    return await this.repository.find({
      where: {
        businessUnit: {
          id: In(businessUnitIds),
        },
      },
      relations: ['businessUnit'],
    });
  }

  async existsByAdminUser(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<boolean> {
    if (isSuperAdmin) {
      return await this.exists(id);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('title');

    const result = await queryBuilder
      .where('title.id = :id', { id: id })
      .andWhere('business_unit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();

    return !!result;
  }
}
