import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { ExaminationCall } from '#academic-offering/domain/entity/examination-call.entity';
import { ExaminationCallRepository } from '#academic-offering/domain/repository/examination-call.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { examinationCallSchema } from '#academic-offering/infrastructure/config/schema/examination-call.schema';
import { Repository } from 'typeorm';

@Injectable()
export class ExaminationCallPostgresRepository
  extends TypeOrmRepository<ExaminationCall>
  implements ExaminationCallRepository
{
  constructor(
    @InjectRepository(examinationCallSchema)
    private repository: Repository<ExaminationCall>,
  ) {
    super();
  }

  async existsById(id: string): Promise<boolean> {
    const examinationCall = await this.repository.findOne({ where: { id } });

    return !!examinationCall;
  }

  async save(examinationCall: ExaminationCall): Promise<void> {
    await this.repository.save({
      id: examinationCall.id,
      name: examinationCall.name,
      startDate: examinationCall.startDate,
      endDate: examinationCall.endDate,
      timezone: examinationCall.timezone,
      academicPeriod: examinationCall.academicPeriod,
      createdAt: examinationCall.createdAt,
      updatedAt: examinationCall.updatedAt,
    });
  }

  async get(id: string): Promise<ExaminationCall | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { academicPeriod: true },
    });
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.academicPeriod`,
      'academic_period',
    );

    return queryBuilder;
  }

  async getByAdminUser(
    examinationCallId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<ExaminationCall | null> {
    if (isSuperAdmin) {
      return await this.get(examinationCallId);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('examinationCall');

    return await queryBuilder
      .where('examinationCall.id = :id', { id: examinationCallId })
      .andWhere('academic_period.businessUnit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async delete(examinationCall: ExaminationCall): Promise<void> {
    await this.repository.delete(examinationCall.id);
  }
}
