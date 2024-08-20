import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { administrativeProcessSchema } from '#student/infrastructure/config/schema/administrative-process.schema';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

@Injectable()
export class AdministrativeProcessPostgresRepository
  extends TypeOrmRepository<AdministrativeProcess>
  implements AdministrativeProcessRepository
{
  constructor(
    @InjectRepository(administrativeProcessSchema)
    private readonly repository: Repository<AdministrativeProcess>,
  ) {
    super();
  }

  async save(administrativeProcess: AdministrativeProcess): Promise<void> {
    await this.repository.save({
      id: administrativeProcess.id,
      type: administrativeProcess.type,
      status: administrativeProcess.status,
      createdAt: administrativeProcess.createdAt,
      updatedAt: administrativeProcess.updatedAt,
      academicRecord: administrativeProcess.academicRecord,
      files: administrativeProcess.files,
      student: administrativeProcess.student,
      businessUnit: administrativeProcess.businessUnit,
    });
  }

  async get(id: string): Promise<AdministrativeProcess | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        academicRecord: true,
        student: true,
        businessUnit: true,
      },
    });
  }

  async getByStudent(studentId: string): Promise<AdministrativeProcess[]> {
    return await this.repository.find({
      where: { student: { id: studentId } },
      relations: {
        academicRecord: true,
        student: true,
        businessUnit: true,
      },
    });
  }

  async getByAcademicRecord(
    academicRecordId: string,
  ): Promise<AdministrativeProcess[]> {
    return await this.repository.find({
      where: { academicRecord: { id: academicRecordId } },
      relations: {
        academicRecord: true,
        student: true,
        businessUnit: true,
      },
    });
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnit`,
      'business_unit',
    );
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicRecord`,
      'academic_record',
    );
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.student`, 'student');

    return queryBuilder;
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'administrativeProcess';
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
  ): Promise<AdministrativeProcess[]> {
    const aliasQuery = 'administrativeProcess';
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
}
