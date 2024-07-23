import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AdministrativeProcessRepository } from '#student/domain/repository/administrative-process.repository';
import { administrativeProcessSchema } from '#student/infrastructure/config/schema/administrative-process.schema';

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
      createdBy: administrativeProcess.createdBy,
      updatedBy: administrativeProcess.updatedBy,
      photo: administrativeProcess.photo,
      identityDocuments: administrativeProcess.identityDocuments,
      accessDocuments: administrativeProcess.accessDocuments,
      academicRecord: administrativeProcess.academicRecord,
    });
  }

  async get(id: string): Promise<AdministrativeProcess | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        createdBy: true,
        updatedBy: true,
        academicRecord: true,
        photo: true,
        identityDocuments: true,
        accessDocuments: true,
      },
    });
  }
}
