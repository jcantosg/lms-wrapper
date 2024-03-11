import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export abstract class EvaluationTypeRepository {
  abstract exists(id: string): Promise<boolean>;

  abstract get(id: string): Promise<EvaluationType | null>;

  abstract save(evaluationType: EvaluationType): Promise<void>;

  abstract getByBusinessUnit(
    businessUnit: BusinessUnit,
  ): Promise<EvaluationType[]>;
}
