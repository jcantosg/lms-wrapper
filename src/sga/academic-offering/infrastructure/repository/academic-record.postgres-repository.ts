import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { academicProgramSchema } from '#academic-offering/infrastructure/config/schema/academic-program.schema';
import { Repository } from 'typeorm';
import { AcademicRecord } from '#academic-offering/domain/entity/academic-record.entity';
import { AcademicRecordRepository } from '#academic-offering/domain/repository/academic-record.repository';

@Injectable()
export class AcademicRecordPostgresRepository
  extends TypeOrmRepository<AcademicRecord>
  implements AcademicRecordRepository
{
  constructor(
    @InjectRepository(academicProgramSchema)
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
}
