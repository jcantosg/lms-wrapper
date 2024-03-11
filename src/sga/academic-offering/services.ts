import { EvaluationTypeGetter } from '#academic-offering/domain/service/evaluation-type-getter.service';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';

const evaluationTypeGetter = {
  provide: EvaluationTypeGetter,
  useFactory: (repository: EvaluationTypeRepository): EvaluationTypeGetter =>
    new EvaluationTypeGetter(repository),
  inject: [EvaluationTypeRepository],
};

export const services = [evaluationTypeGetter];
