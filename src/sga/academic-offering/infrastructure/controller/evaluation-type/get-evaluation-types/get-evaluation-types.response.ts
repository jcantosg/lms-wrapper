import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';

export class GetEvaluationTypesResponse {
  static create(evaluationTypes: EvaluationType[]) {
    return evaluationTypes.map((evaluationType: EvaluationType) => {
      return {
        id: evaluationType.id,
        name: evaluationType.name,
      };
    });
  }
}
