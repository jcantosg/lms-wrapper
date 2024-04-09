import { GetEvaluationTypesHandler } from '#academic-offering/applicaton/evaluation-type/get-evaluation-types/get-evaluation-types.handler';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';

const getEvaluationTypesHandler = {
  provide: GetEvaluationTypesHandler,
  useFactory: (
    repository: EvaluationTypeRepository,
    businessUnitGetter: BusinessUnitGetter,
  ) => {
    return new GetEvaluationTypesHandler(repository, businessUnitGetter);
  },
  inject: [EvaluationTypeRepository, BusinessUnitGetter],
};
export const evaluationTypeHandlers = [getEvaluationTypesHandler];
