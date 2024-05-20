import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { AdministrativeGroup } from '#student/domain/entity/administrative-group.entity';
import { AdministrativeGroupRepository } from '#student/domain/repository/administrative-group.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { administrativeGroupSchema } from '#student/infrastructure/config/schema/administrative-group.schema';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

@Injectable()
export class AdministrativeGroupPostgresRepository
  extends TypeOrmRepository<AdministrativeGroup>
  implements AdministrativeGroupRepository
{
  constructor(
    @InjectRepository(administrativeGroupSchema)
    private readonly repository: Repository<AdministrativeGroup>,
  ) {
    super();
  }

  async save(administrativeGroup: AdministrativeGroup): Promise<void> {
    await this.repository.save({
      id: administrativeGroup.id,
      code: administrativeGroup.code,
      businessUnit: administrativeGroup.businessUnit,
      academicPeriod: administrativeGroup.academicPeriod,
      academicProgram: administrativeGroup.academicProgram,
      programBlock: administrativeGroup.programBlock,
      periodBlock: administrativeGroup.periodBlock,
      students: administrativeGroup.students,
      teachers: administrativeGroup.teachers,
      createdAt: administrativeGroup.createdAt,
      createdBy: administrativeGroup.createdBy,
      updatedAt: administrativeGroup.updatedAt,
      updatedBy: administrativeGroup.updatedBy,
      studentsNumber: administrativeGroup.studentsNumber,
    });
  }

  async existsById(id: string): Promise<boolean> {
    const administrativeGroup = await this.repository.findOne({
      where: { id },
    });

    return !!administrativeGroup;
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const result = await this.repository.findOne({
      where: { code },
    });

    return result !== null && result.id !== id;
  }

  async saveBatch(administrativeGroups: AdministrativeGroup[]): Promise<void> {
    await this.repository.save(administrativeGroups);
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
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.programBlock`,
      'program_block',
    );

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.students`, 'students');
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.teachers`, 'teachers');
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.periodBlock`, 'period_block');

    return queryBuilder;
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'administrativeGroup';
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
  ): Promise<AdministrativeGroup[]> {
    const aliasQuery = 'administrativeGroup';
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

  async get(id: string): Promise<AdministrativeGroup | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        businessUnit: true,
        academicPeriod: true,
        academicProgram: true,
        programBlock: true,
        periodBlock: true,
        students: true,
        teachers: true,
      },
    });
  }

  async getByAdminUser(
    administrativeGroupId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AdministrativeGroup | null> {
    if (isSuperAdmin) {
      return await this.get(administrativeGroupId);
    }
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('administrativeGroup');

    return await queryBuilder
      .where('administrativeGroup.id = :id', { id: administrativeGroupId })
      .andWhere('business_unit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }
}
