import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { Enrollment } from '#student/domain/entity/enrollment.entity';

export class SubjectPostgresRepository
  extends TypeOrmRepository<Subject>
  implements SubjectRepository
{
  constructor(
    @InjectRepository(subjectSchema)
    private readonly repository: Repository<Subject>,
  ) {
    super();
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { code } });

    return !result ? false : result.id !== id;
  }

  async save(subject: Subject): Promise<void> {
    await this.repository.save({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      officialCode: subject.officialCode,
      hours: subject.hours,
      modality: subject.modality,
      evaluationType: subject.evaluationType,
      type: subject.type,
      businessUnit: subject.businessUnit,
      teachers: subject.teachers,
      defaultTeacher: subject.defaultTeacher,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      createdBy: subject.createdBy,
      updatedBy: subject.updatedBy,
      isRegulated: subject.isRegulated,
      isCore: subject.isCore,
      image: subject.image,
      resources: subject.resources,
      officialRegionalCode: subject.officialRegionalCode,
      programBlocks: subject.programBlocks,
      lmsCourse: subject.lmsCourse,
    });
  }

  async get(id: string): Promise<Subject | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        businessUnit: true,
        evaluationType: true,
        teachers: true,
        defaultTeacher: true,
        resources: true,
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
      `${aliasQuery}.evaluationType`,
      'evaluation_type',
    );

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.resources`, 'resources');

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.teachers`, 'teachers');

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.defaultTeacher`,
      'default_teacher',
    );

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.programBlocks`,
      'program_blocks',
    );

    return queryBuilder;
  }

  async getByAdminUser(
    subjectId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Subject | null> {
    if (isSuperAdmin) {
      return await this.get(subjectId);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('subject');

    return await queryBuilder
      .where('subject.id = :id', { id: subjectId })
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
    const aliasQuery = 'subjects';
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
  ): Promise<Subject[]> {
    const aliasQuery = 'subjects';
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

  async getByBusinessUnit(
    businessUnitId: string,
    academicProgramId: string,
  ): Promise<Subject[]> {
    const assignedSubjects =
      await this.getSubjectsByAcademicProgram(academicProgramId);

    const assignedSubjectsIds = assignedSubjects.map((subject) => subject.id);

    return this.repository.find({
      where: {
        businessUnit: {
          id: businessUnitId,
        },
        id: Not(In(assignedSubjectsIds)),
      },
    });
  }

  public getSubjectsByAcademicProgram(academicProgramId: string) {
    return this.repository.find({
      where: {
        programBlocks: {
          academicProgram: {
            id: academicProgramId,
          },
        },
      },
      relations: {
        programBlocks: {
          academicProgram: true,
        },
      },
    });
  }

  async getSubjectsNotEnrolled(
    academicRecord: AcademicRecord,
  ): Promise<Subject[]> {
    const aliasQuery = 'subjects';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery)
      .leftJoinAndSelect(
        Enrollment,
        'enrollments',
        'enrollments.subject_id = subjects.id',
      )
      .andWhere('enrollments.subject_id  IS NULL')
      .andWhere('enrollments.academic_record_id = :id', {
        id: academicRecord.id,
      });

    return await queryBuilder.getMany();
  }
}
