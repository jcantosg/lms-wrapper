import { QueryHandler } from '#shared/domain/bus/query.handler';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { GetSubjectsByBusinessUnitQuery } from '#academic-offering/applicaton/subject/get-subjects-by-business-unit/get-subjects-by-business-unit.query';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { BusinessUnitNotFoundException } from '#shared/domain/exception/business-unit/business-unit/business-unit-not-found.exception';

export class GetSubjectsByBusinessUnitHandler implements QueryHandler {
  constructor(private readonly repository: SubjectRepository) {}

  async handle(query: GetSubjectsByBusinessUnitQuery): Promise<Subject[]> {
    if (
      !query.adminUser.businessUnits
        .map((bu) => bu.id)
        .includes(query.businessUnitId)
    ) {
      throw new BusinessUnitNotFoundException();
    }

    const subjects = await this.repository.getByBusinessUnit(
      query.businessUnitId,
      query.academicProgramId,
    );

    if (query.subjectType) {
      return subjects.filter((subject) => subject.type === query.subjectType);
    }

    return subjects;
  }
}
