import { QueryHandler } from '#shared/domain/bus/query.handler';
import { EvaluationTypeRepository } from '#academic-offering/domain/repository/evaluation-type.repository';
import { GetEvaluationTypesQuery } from '#academic-offering/applicaton/evaluation-type/get-evaluation-types/get-evaluation-types.query';
import { EvaluationType } from '#academic-offering/domain/entity/evaluation-type.entity';
import { BusinessUnitGetter } from '#business-unit/domain/service/business-unit-getter.service';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetEvaluationTypesHandler implements QueryHandler {
  constructor(
    private readonly repository: EvaluationTypeRepository,
    private readonly businessUnitGetter: BusinessUnitGetter,
  ) {}

  async handle(query: GetEvaluationTypesQuery): Promise<EvaluationType[]> {
    const businessUnit = await this.businessUnitGetter.getByAdminUser(
      query.businessUnitId,
      query.adminUser.businessUnits.map(
        (businessUnit: BusinessUnit) => businessUnit.id,
      ),
    );

    return await this.repository.getByBusinessUnit(businessUnit);
  }
}
