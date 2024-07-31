import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { AcademicProgramRepository } from '#academic-offering/domain/repository/academic-program.repository';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';

@Injectable()
export class AcademicProgramPostgresRepository
  extends TypeOrmRepository<AcademicProgram>
  implements AcademicProgramRepository
{
  constructor(
    @InjectRepository(academicProgramSchema)
    private readonly repository: Repository<AcademicProgram>,
  ) {
    super();
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const academicProgram = await this.repository.findOne({
      where: { code },
    });

    return !academicProgram ? false : academicProgram.id !== id;
  }

  async existsById(id: string): Promise<boolean> {
    const academicProgram = await this.repository.findOne({
      where: { id },
    });

    return !!academicProgram;
  }

  async save(academicProgram: AcademicProgram): Promise<void> {
    await this.repository.save({
      id: academicProgram.id,
      name: academicProgram.name,
      code: academicProgram.code,
      title: academicProgram.title,
      businessUnit: academicProgram.businessUnit,
      createdAt: academicProgram.createdAt,
      createdBy: academicProgram.createdBy,
      updatedAt: academicProgram.updatedAt,
      updatedBy: academicProgram.updatedBy,
      structureType: academicProgram.structureType,
      programBlocks: academicProgram.programBlocks,
      academicPeriods: academicProgram.academicPeriods,
      programBlocksNumber: academicProgram.programBlocksNumber,
    });
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnit`,
      'business_unit',
    );

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.title`, 'title');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.programBlocks`,
      'programBlock',
    );

    queryBuilder.leftJoinAndSelect(
      `programBlock.subjects`,
      'programBlockSubject',
    );

    queryBuilder.leftJoinAndSelect(
      `programBlockSubject.defaultTeacher`,
      'defaultTeacher',
    );

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicPeriods`,
      'academicPeriods',
    );

    return queryBuilder;
  }

  async get(id: string): Promise<AcademicProgram | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        businessUnit: true,
        title: true,
        programBlocks: {
          subjects: {
            defaultTeacher: true,
          },
        },
        academicPeriods: true,
      },
    });
  }

  async getByCode(code: string): Promise<AcademicProgram | null> {
    return await this.repository.findOne({
      where: { code },
      relations: {
        businessUnit: true,
        title: true,
        programBlocks: { subjects: true },
        academicPeriods: true,
      },
    });
  }

  async getByAdminUser(
    academicProgramId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicProgram | null> {
    if (isSuperAdmin) {
      return await this.get(academicProgramId);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('academicProgram');

    return await queryBuilder
      .where('academicProgram.id = :id', { id: academicProgramId })
      .andWhere('business_unit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'academicProgram';
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
  ): Promise<AcademicProgram[]> {
    const aliasQuery = 'academicProgram';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'oneToMany',
          adminUserBusinessUnits,
        );

    let criteriaToQueryBuilder =
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      );

    if (criteria.page !== null && criteria.limit !== null) {
      criteriaToQueryBuilder = criteriaToQueryBuilder.applyPagination(
        criteria,
        queryBuilder,
      );
    }

    if (criteria.order !== null) {
      criteriaToQueryBuilder.applyOrder(criteria, queryBuilder, aliasQuery);
    }

    return await this.getMany(queryBuilder);
  }

  async getByAcademicPeriod(
    academicPeriodId: string,
    hasAdministrativeGroup?: boolean,
  ): Promise<AcademicProgram[]> {
    const academicPrograms = await this.repository.find({
      relations: { academicPeriods: true, administrativeGroups: true },
      where: {
        academicPeriods: {
          id: academicPeriodId,
        },
      },
    });

    if (hasAdministrativeGroup === undefined) {
      return academicPrograms;
    }

    if (hasAdministrativeGroup) {
      return academicPrograms.filter(
        (academicProgram) => academicProgram.administrativeGroups.length > 0,
      );
    }

    return academicPrograms.filter(
      (academicProgram) => academicProgram.administrativeGroups.length === 0,
    );
  }
}
