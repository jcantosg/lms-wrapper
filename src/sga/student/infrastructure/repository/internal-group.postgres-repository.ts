import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class InternalGroupPostgresRepository
  extends TypeOrmRepository<InternalGroup>
  implements InternalGroupRepository
{
  constructor(
    @InjectRepository(internalGroupSchema)
    private repository: Repository<InternalGroup>,
  ) {
    super();
  }

  async save(internalGroup: InternalGroup): Promise<void> {
    await this.repository.save({
      id: internalGroup.id,
      academicPeriod: internalGroup.academicPeriod,
      academicProgram: internalGroup.academicProgram,
      businessUnit: internalGroup.businessUnit,
      code: internalGroup.code,
      createdAt: internalGroup.createdAt,
      isDefault: internalGroup.isDefault,
      periodBlock: internalGroup.periodBlock,
      students: internalGroup.students,
      subject: internalGroup.subject,
      teachers: internalGroup.teachers,
      updatedAt: internalGroup.updatedAt,
      createdBy: internalGroup.createdBy,
      updatedBy: internalGroup.updatedBy,
    });
  }

  async saveBatch(internalGroups: InternalGroup[]): Promise<void> {
    await this.repository.save(
      internalGroups.map((internalGroup) => ({
        id: internalGroup.id,
        academicPeriod: internalGroup.academicPeriod,
        academicProgram: internalGroup.academicProgram,
        businessUnit: internalGroup.businessUnit,
        code: internalGroup.code,
        createdAt: internalGroup.createdAt,
        isDefault: internalGroup.isDefault,
        periodBlock: internalGroup.periodBlock,
        students: internalGroup.students,
        subject: internalGroup.subject,
        teachers: internalGroup.teachers,
        updatedAt: internalGroup.updatedAt,
        createdBy: internalGroup.createdBy,
        updatedBy: internalGroup.updatedBy,
      })),
    );
  }

  async get(id: string): Promise<InternalGroup | null> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async getByKeys(
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    subject: Subject,
  ): Promise<InternalGroup[]> {
    return await this.repository.find({
      where: {
        academicPeriod: { id: academicPeriod.id },
        academicProgram: { id: academicProgram.id },
        subject: { id: subject.id },
      },
    });
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'internalGroup';
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
  ): Promise<InternalGroup[]> {
    const aliasQuery = 'internalGroup';
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
      `${aliasQuery}.academicPeriod`,
      'academic_period',
    );
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicProgram`,
      'academic_program',
    );
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.subject`, 'subject');
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.periodBlock`, 'period_block');

    return queryBuilder;
  }
}
