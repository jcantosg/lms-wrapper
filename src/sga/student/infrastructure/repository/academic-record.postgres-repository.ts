import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { Student } from '#shared/domain/entity/student.entity';

@Injectable()
export class AcademicRecordPostgresRepository
  extends TypeOrmRepository<AcademicRecord>
  implements AcademicRecordRepository
{
  constructor(
    @InjectRepository(academicRecordSchema)
    private readonly repository: Repository<AcademicRecord>,
  ) {
    super();
  }

  async save(academicRecord: AcademicRecord): Promise<void> {
    await this.repository.save({
      id: academicRecord.id,
      businessUnit: academicRecord.businessUnit,
      virtualCampus: academicRecord.virtualCampus,
      student: academicRecord.student,
      academicPeriod: academicRecord.academicPeriod,
      initialAcademicPeriod: academicRecord.initialAcademicPeriod,
      academicProgram: academicRecord.academicProgram,
      modality: academicRecord.modality,
      isModular: academicRecord.isModular,
      status: academicRecord.status,
      createdAt: academicRecord.createdAt,
      createdBy: academicRecord.createdBy,
      updatedAt: academicRecord.updatedAt,
      updatedBy: academicRecord.updatedBy,
      leadId: academicRecord.leadId,
    });
  }

  async existsById(id: string): Promise<boolean> {
    const academicRecord = await this.repository.findOne({
      where: { id },
    });

    return !!academicRecord;
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnit`,
      'business_unit',
    );
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.student`, 'student');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicProgram`,
      'academicProgram',
    );
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicPeriod`,
      'academicPeriod',
    );
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.initialAcademicPeriod`,
      'initialAcademicPeriod',
    );
    queryBuilder.leftJoinAndSelect(
      'academicProgram.title',
      'academicProgramTitle',
    );
    queryBuilder.leftJoinAndSelect(
      'academicProgram.programBlocks',
      'academicProgramProgramBlocks',
    );
    queryBuilder.leftJoinAndSelect(
      'academicProgram.academicPeriods',
      'academicProgramAcademicPeriods',
    );
    queryBuilder.leftJoinAndSelect(
      'academicProgramAcademicPeriods.periodBlocks',
      'academicProgramPeriodBlocks',
    );
    queryBuilder.leftJoinAndSelect(
      'academicProgramProgramBlocks.subjects',
      'academicProgramBlockSubjects',
    );

    return queryBuilder;
  }

  async getByAdminUser(
    academicRecordId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicRecord | null> {
    if (isSuperAdmin) {
      return await this.get(academicRecordId);
    }
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('academicRecord');

    return await queryBuilder
      .where('academicRecord.id = :id', { id: academicRecordId })
      .andWhere('business_unit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async get(id: string): Promise<AcademicRecord | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        businessUnit: true,
        student: true,
        academicPeriod: true,
        initialAcademicPeriod: true,
        academicProgram: {
          title: true,
          programBlocks: {
            subjects: true,
          },
        },
        virtualCampus: true,
      },
    });
  }

  async getStudentOwnAcademicRecords(id: string): Promise<AcademicRecord[]> {
    return await this.repository.find({
      where: {
        student: { id },
        status:
          Not(AcademicRecordStatusEnum.CANCELLED) ||
          Not(AcademicRecordStatusEnum.CANCELLED_TRANSFER),
      },
      relations: {
        businessUnit: true,
        student: true,
        academicPeriod: true,
        academicProgram: {
          title: true,
          programBlocks: {
            subjects: true,
          },
        },
        virtualCampus: true,
      },
    });
  }

  async getStudentAcademicRecords(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicRecord[]> {
    if (isSuperAdmin) {
      return await this.repository.find({
        where: { student: { id } },
        relations: {
          businessUnit: true,
          student: true,
          academicPeriod: true,
          academicProgram: {
            title: true,
            programBlocks: {
              subjects: true,
            },
          },
          virtualCampus: true,
        },
      });
    }
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('academicRecord');

    return await queryBuilder
      .where('student.id = :id', { id: id })
      .andWhere('business_unit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getMany();
  }

  async getStudentAcademicRecordByPeriodAndProgram(
    studentId: string,
    academicPeriodId: string,
    academicProgramId: string,
  ): Promise<AcademicRecord | null> {
    return await this.repository.findOne({
      where: {
        student: { id: studentId },
        academicPeriod: { id: academicPeriodId },
        academicProgram: { id: academicProgramId },
        status: Not(AcademicRecordStatusEnum.CANCELLED),
      },
      relations: {
        academicProgram: true,
        academicPeriod: true,
      },
    });
  }

  async matching(criteria: Criteria): Promise<AcademicRecord[]> {
    const queryBuilder = this.initializeQueryBuilder('academicRecord');
    let criteriaToQueryBuilder = await this.convertCriteriaToQueryBuilder(
      criteria,
      queryBuilder,
      'academicRecord',
    );
    if (criteria.page !== null && criteria.limit !== null) {
      criteriaToQueryBuilder = criteriaToQueryBuilder.applyPagination(
        criteria,
        queryBuilder,
      );
    }
    if (criteria.order !== null) {
      criteriaToQueryBuilder.applyOrder(criteria, queryBuilder, 'enrollment');
    }

    return await this.getMany(queryBuilder);
  }

  async getByStudent(
    id: string,
    student: Student,
  ): Promise<AcademicRecord | null> {
    return await this.repository.findOne({
      where: {
        id: id,
        student: {
          id: student.id,
        },
      },
      relations: {
        academicProgram: {
          title: true,
          programBlocks: {
            blockRelation: {
              programBlock: true,
              periodBlock: {
                academicPeriod: true,
              },
            },
            subjects: {
              defaultTeacher: true,
              enrollments: {
                academicRecord: true,
                calls: true,
              },
              evaluationType: true,
            },
          },
        },
        academicPeriod: true,
      },
    });
  }
}
