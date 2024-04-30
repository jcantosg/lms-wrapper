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
}
