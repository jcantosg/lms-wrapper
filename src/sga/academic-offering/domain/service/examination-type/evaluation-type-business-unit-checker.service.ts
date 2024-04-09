import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { EvaluationTypeNotFoundException } from '#shared/domain/exception/academic-offering/evaluation-type.not-found.exception';

export class EvaluationTypeBusinessUnitChecker {
  checkEvaluationTypeBusinessUnit(
    evaluationType: EvaluationType | null,
    businessUnits: BusinessUnit[],
  ) {
    if (evaluationType) {
      let found = false;
      const evaluationTypeBusinessUnitsIds = evaluationType.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      );
      const adminUserBusinessUnitsIds = businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      );
      evaluationTypeBusinessUnitsIds.forEach((businessUnitId: string) => {
        if (adminUserBusinessUnitsIds.includes(businessUnitId)) {
          found = true;
        }
      });
      if (!found) {
        throw new EvaluationTypeNotFoundException();
      }
    }
  }
}
