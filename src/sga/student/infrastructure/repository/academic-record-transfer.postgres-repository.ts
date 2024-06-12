import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicRecordTransfer } from '#student/domain/entity/academic-record-transfer.entity';
import { AcademicRecordTransferRepository } from '#student/domain/repository/academic-record-transfer.repository';
import { academicRecordTransferSchema } from '#student/infrastructure/config/schema/academic-record-transfer.schema';

@Injectable()
export class AcademicRecordTransferPostgresRepository
  extends TypeOrmRepository<AcademicRecordTransfer>
  implements AcademicRecordTransferRepository
{
  constructor(
    @InjectRepository(academicRecordTransferSchema)
    private readonly repository: Repository<AcademicRecordTransfer>,
  ) {
    super();
  }

  async save(academicRecordTransfer: AcademicRecordTransfer): Promise<void> {
    await this.repository.save(academicRecordTransfer);
  }

  async existsById(id: string): Promise<boolean> {
    const academicRecordTransfer = await this.repository.findOne({
      where: { id },
    });

    return !!academicRecordTransfer;
  }

  async get(id: string): Promise<AcademicRecordTransfer | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        createdBy: true,
        updatedBy: true,
        oldAcademicRecord: true,
        newAcademicRecord: true,
      },
    });
  }
}
