import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { InternalGroup } from '#student/domain/entity/internal-group.entity';
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
      defaultTeacher: internalGroup.defaultTeacher,
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
        defaultTeacher: internalGroup.defaultTeacher,
      })),
    );
  }

  async get(id: string): Promise<InternalGroup | null> {
    return await this.repository.findOne({
      where: { id: id },
      relations: {
        businessUnit: true,
        students: true,
        teachers: true,
        academicPeriod: true,
        academicProgram: true,
        periodBlock: true,
        subject: true,
        defaultTeacher: true,
      },
    });
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
      relations: {
        students: true,
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
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.teachers`, 'teachers');
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.students`, 'students');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.defaultTeacher`,
      'default_teacher',
    );

    return queryBuilder;
  }

  async getByAdminUser(
    internalGroupId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<InternalGroup | null> {
    if (isSuperAdmin) {
      return await this.get(internalGroupId);
    }
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('internalGroup');

    return await queryBuilder
      .where('internalGroup.id = :id', { id: internalGroupId })
      .andWhere('business_unit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async getByStudentAndSubject(
    studentId: string,
    subjectId: string,
  ): Promise<InternalGroup | null> {
    return await this.repository.findOne({
      where: {
        subject: {
          id: subjectId,
        },
        students: {
          id: studentId,
        },
      },
      relations: {
        defaultTeacher: true,
        teachers: true,
        subject: true,
        students: true,
      },
    });
  }

  async getAllByStudentAndKeys(
    studentId: string,
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
  ): Promise<InternalGroup[]> {
    const groups = await this.repository.find({
      where: {
        academicPeriod: { id: academicPeriod.id },
        academicProgram: { id: academicProgram.id },
      },
      relations: {
        defaultTeacher: true,
        subject: true,
        students: true,
      },
    });

    return groups.filter((group) => {
      return group.students.find((student) => student.id === studentId);
    });
  }

  async getAllByStudent(studentId: string): Promise<InternalGroup[]> {
    return await this.repository.find({
      where: {
        students: {
          id: studentId,
        },
      },
      relations: {
        defaultTeacher: true,
        subject: true,
        academicProgram: true,
        academicPeriod: true,
        students: true,
      },
    });
  }

  async getAllByTeacher(teacherId: string): Promise<InternalGroup[]> {
    return await this.repository
      .createQueryBuilder('internalGroup')
      .leftJoinAndSelect('internalGroup.academicPeriod', 'academicPeriod')
      .leftJoinAndSelect('internalGroup.academicProgram', 'academicProgram')
      .leftJoinAndSelect('academicProgram.title', 'title')
      .leftJoinAndSelect('internalGroup.subject', 'subject')
      .leftJoinAndSelect(`internalGroup.teachers`, 'teachers')
      .leftJoinAndSelect('internalGroup.businessUnit', 'businessUnit')
      .where('teachers.id = :teacherId', { teacherId })
      .select([
        'internalGroup.id',
        'academicPeriod.id',
        'academicPeriod.code',
        'academicPeriod.name',
        'academicProgram.id',
        'title.id',
        'title.name',
        'subject.id',
        'subject.code',
        'subject.name',
        'businessUnit.id',
        'businessUnit.name',
      ])
      .getMany();
  }

  async getByBusinessUnitsAndPeriodsAndPrograms(
    businessUnitIds: string[],
    academicPeriodIds: string[],
    academicProgramIds: string[],
  ): Promise<InternalGroup[]> {
    return await this.repository.find({
      where: {
        businessUnit: { id: In(businessUnitIds) },
        academicPeriod: { id: In(academicPeriodIds) },
        academicProgram: { id: In(academicProgramIds) },
      },
      relations: {
        businessUnit: true,
        academicPeriod: true,
        academicProgram: true,
        periodBlock: true,
        subject: true,
        teachers: true,
        students: true,
        defaultTeacher: true,
      },
    });
  }
}
