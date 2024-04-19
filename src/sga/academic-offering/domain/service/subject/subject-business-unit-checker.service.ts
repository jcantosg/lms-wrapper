import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { SubjectNotFoundException } from '#shared/domain/exception/academic-offering/subject.not-found.exception';

export class SubjectBusinessUnitChecker {
  checkSubjectBusinessUnit(subject: Subject, businessUnits: BusinessUnit[]) {
    const subjectBusinessUnitId = subject.businessUnit.id;
    const adminUserBusinessUnitsIds = businessUnits.map(
      (businessUnit: BusinessUnit) => businessUnit.id,
    );
    if (!adminUserBusinessUnitsIds.includes(subjectBusinessUnitId)) {
      throw new SubjectNotFoundException();
    }
  }
}
