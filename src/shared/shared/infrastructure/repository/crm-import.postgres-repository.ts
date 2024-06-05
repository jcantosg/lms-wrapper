import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CRMImportRepository } from '#shared/domain/repository/crm-import.repository';
import { crmImportSchema } from '#shared/infrastructure/config/schema/crm-import.schema';
import { CRMImport } from '#shared/domain/entity/crm-import.entity';

@Injectable()
export class CRMImportPostgresRepository implements CRMImportRepository {
  constructor(
    @InjectRepository(crmImportSchema)
    private readonly repository: Repository<CRMImport>,
  ) {}

  async save(crmImport: CRMImport): Promise<void> {
    await this.repository.save({
      id: crmImport.id,
      contactId: crmImport.contactId,
      createdAt: crmImport.createdAt,
      data: crmImport.data,
      fileName: crmImport.fileName,
      leadId: crmImport.leadId,
      status: crmImport.status,
      updatedAt: crmImport.updatedAt,
      errorMessage: crmImport.errorMessage,
    });
  }

  async get(id: string): Promise<CRMImport | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async getByFileName(fileName: string): Promise<CRMImport | null> {
    return await this.repository.findOne({ where: { fileName } });
  }
}
