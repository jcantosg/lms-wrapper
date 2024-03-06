import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicPeriodRepository } from '#academic-offering/domain/repository/academic-period.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { academicPeriodSchema } from '#academic-offering/infrastructure/config/schema/academic-period.schema';
import { Repository } from 'typeorm';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

@Injectable()
export class AcademicPeriodPostgresRepository
  extends TypeOrmRepository<AcademicPeriod>
  implements AcademicPeriodRepository
{
  constructor(
    @InjectRepository(academicPeriodSchema)
    private readonly repository: Repository<AcademicPeriod>,
  ) {
    super();
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const academicPeriod = await this.repository.findOne({
      where: { id, code },
    });

    return !academicPeriod ? false : academicPeriod.code !== code;
  }

  async existsById(id: string): Promise<boolean> {
    const academicPeriod = await this.repository.findOne({
      where: { id },
    });

    return !!academicPeriod;
  }

  async save(academicPeriod: AcademicPeriod): Promise<void> {
    await this.repository.save({
      id: academicPeriod.id,
      name: academicPeriod.name,
      code: academicPeriod.code,
      startDate: academicPeriod.startDate,
      endDate: academicPeriod.endDate,
      businessUnit: academicPeriod.businessUnit,
      examinationCalls: academicPeriod.examinationCalls,
      blocksNumber: academicPeriod.blocksNumber,
    });
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnit`,
      'business_unit',
    );

    return queryBuilder;
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'academicPeriod';
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
  ): Promise<AcademicPeriod[]> {
    const aliasQuery = 'academicPeriod';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'oneToMany',
          adminUserBusinessUnits,
        );

    const result = await baseRepository.convertCriteriaToQueryBuilder(
      criteria,
      queryBuilder,
      aliasQuery,
    );

    return result
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getMany(queryBuilder);
  }
}