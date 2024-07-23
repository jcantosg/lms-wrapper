import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { administrativeProcessDocumentSchema } from '#student/infrastructure/config/schema/administrative-process-document.schema';
import { AdministrativeProcessDocument } from '#student/domain/entity/administrative-process-document.entity';
import { AdministrativeProcessDocumentRepository } from '#student/domain/repository/administrative-process-document.repository';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';

@Injectable()
export class AdministrativeProcessDocumentPostgresRepository
  extends TypeOrmRepository<AdministrativeProcessDocument>
  implements AdministrativeProcessDocumentRepository
{
  constructor(
    @InjectRepository(administrativeProcessDocumentSchema)
    private readonly repository: Repository<AdministrativeProcessDocument>,
  ) {
    super();
  }

  async save(
    administrativeProcessDocument: AdministrativeProcessDocument,
  ): Promise<void> {
    await this.repository.save({
      id: administrativeProcessDocument.id,
      type: administrativeProcessDocument.type,
      status: administrativeProcessDocument.status,
      createdAt: administrativeProcessDocument.createdAt,
      updatedAt: administrativeProcessDocument.updatedAt,
      student: administrativeProcessDocument.student,
      academicRecord: administrativeProcessDocument.academicRecord,
      files: administrativeProcessDocument.files,
    });
  }

  async get(id: string): Promise<AdministrativeProcessDocument | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        academicRecord: true,
        student: true,
      },
    });
  }

  async getLastIdentityDocumentsByStudent(
    studentId: string,
  ): Promise<AdministrativeProcessDocument | null> {
    return await this.repository.findOne({
      where: {
        student: { id: studentId },
        type: AdministrativeProcessTypeEnum.IDENTITY_DOCUMENTS,
      },
      relations: {
        academicRecord: true,
        student: true,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
