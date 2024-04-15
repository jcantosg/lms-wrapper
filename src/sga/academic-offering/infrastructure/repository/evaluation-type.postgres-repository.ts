import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { evaluationTypeSchema } from '#academic-offering/infrastructure/config/schema/evaluation-type.schema';

export class EvaluationTypePostgresRepository
  extends TypeOrmRepository<EvaluationType>
  implements EvaluationTypeRepository
{
  constructor(
    @InjectRepository(evaluationTypeSchema)
    private readonly repository: Repository<EvaluationType>,
  ) {
    super();
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async get(id: string): Promise<EvaluationType | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { businessUnits: true },
    });
  }

  async save(evaluationType: EvaluationType): Promise<void> {
    await this.repository.save({
      id: evaluationType.id,
      name: evaluationType.name,
      percentageVirtualCampus: evaluationType.percentageVirtualCampus,
      percentageAttendance: evaluationType.percentageAttendance,
      percentageProject: evaluationType.percentageProject,
      isPassed: evaluationType.isPassed,
      businessUnits: evaluationType.businessUnits,
      createdAt: evaluationType.createdAt,
      updatedAt: evaluationType.updatedAt,
    });
  }

  async getByBusinessUnit(
    businessUnit: BusinessUnit,
  ): Promise<EvaluationType[]> {
    return await this.repository.find({
      where: {
        businessUnits: {
          id: businessUnit.id,
        },
      },
    });
  }
}
