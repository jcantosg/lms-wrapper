import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordRepository } from '#student/domain/repository/academic-record.repository';
import { academicRecordSchema } from '#student/infrastructure/config/schema/academic-record.schema';

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
      academicProgram: academicRecord.academicProgram,
      modality: academicRecord.modality,
      isModular: academicRecord.isModular,
      status: academicRecord.status,
      createdAt: academicRecord.createdAt,
      createdBy: academicRecord.createdBy,
      updatedAt: academicRecord.updatedAt,
      updatedBy: academicRecord.updatedBy,
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

  async getStudentAcademicRecord(
    id: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<AcademicRecord[] | null> {
    if (isSuperAdmin) {
      return await this.repository.find({
        where: { student: { id } },
        relations: {
          academicProgram: {
            title: true,
          },
          academicPeriod: true,
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
}
