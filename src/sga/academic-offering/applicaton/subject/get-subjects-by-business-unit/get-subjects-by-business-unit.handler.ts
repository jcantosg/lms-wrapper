import { QueryHandler } from '#shared/domain/bus/query.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { GetSubjectsByBusinessUnitQuery } from '#academic-offering/applicaton/subject/get-subjects-by-business-unit/get-subjects-by-business-unit.query';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

export class GetSubjectsByBusinessUnitHandler implements QueryHandler {
  constructor(private readonly repository: SubjectRepository) {}

  async handle(query: GetSubjectsByBusinessUnitQuery): Promise<Subject[]> {
    let businessUnitBelongsToUser = false;
    query.adminUser.businessUnits.forEach((businessUnit: BusinessUnit) => {
      businessUnitBelongsToUser = businessUnit.id === query.businessUnitId;
    });
    if (!businessUnitBelongsToUser) {
      throw new BusinessUnitNotFoundException();
    }

    return await this.repository.getByBusinessUnit(query.businessUnitId);
  }
}
