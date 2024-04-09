import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { EvaluationTypeNotFoundException } from '#shared/domain/exception/academic-offering/evaluation-type.not-found.exception';

export class EvaluationTypeGetter {
  constructor(private readonly repository: EvaluationTypeRepository) {}

  async get(id: string): Promise<EvaluationType> {
    const evaluationType = await this.repository.get(id);
    if (!evaluationType) {
      throw new EvaluationTypeNotFoundException();
    }

    return evaluationType;
  }
}
