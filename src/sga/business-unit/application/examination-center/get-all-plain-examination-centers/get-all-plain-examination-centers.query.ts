import { Query } from '#shared/domain/bus/query';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetAllPlainExaminationCentersQuery implements Query {
  constructor(
    readonly adminUserBusinessUnits: BusinessUnit[],
    readonly isSuperAdmin: boolean,
  ) {}
}
