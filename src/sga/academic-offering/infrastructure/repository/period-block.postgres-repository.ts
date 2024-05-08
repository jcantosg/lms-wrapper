import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { PeriodBlock } from '#academic-offering/domain/entity/period-block.entity';
import { periodBlockSchema } from '#academic-offering/infrastructure/config/schema/period-block.schema';
import { PeriodBlockRepository } from '#academic-offering/domain/repository/period-block.repository';

@Injectable()
export class PeriodBlockPostgresRepository
  extends TypeOrmRepository<PeriodBlock>
  implements PeriodBlockRepository
{
  constructor(
    @InjectRepository(periodBlockSchema)
    private readonly repository: Repository<PeriodBlock>,
  ) {
    super();
  }

  async existsById(id: string): Promise<boolean> {
    const periodBlock = await this.repository.findOne({ where: { id } });

    return !!periodBlock;
  }

  async get(id: string): Promise<PeriodBlock | null> {
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
    periodBlockId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<PeriodBlock | null> {
    if (isSuperAdmin) {
      return await this.get(periodBlockId);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('periodBlock');

    return await queryBuilder
      .where('periodBlock.id = :id', { id: periodBlockId })
      .andWhere('academic_period.businessUnit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async save(periodBlock: PeriodBlock): Promise<void> {
    await this.repository.save({
      id: periodBlock.id,
      academicPeriod: periodBlock.academicPeriod,
      name: periodBlock.name,
      startDate: periodBlock.startDate,
      endDate: periodBlock.endDate,
      createdBy: periodBlock.createdBy,
      createdAt: periodBlock.createdAt,
      updatedBy: periodBlock.updatedBy,
      updatedAt: periodBlock.updatedAt,
    });
  }

  async delete(periodBlock: PeriodBlock): Promise<void> {
    await this.repository.delete(periodBlock.id);
  }

  async getByAcademicPeriod(academicPeriodId: string): Promise<PeriodBlock[]> {
    return await this.repository.find({
      where: { academicPeriod: { id: academicPeriodId } },
      relations: { academicPeriod: true },
    });
  }
}
