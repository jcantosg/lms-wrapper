import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Query } from '#shared/domain/bus/query';

export class GetAllAcademicProgramsByPeriodQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    public readonly academicPeriodId: string,
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    public readonly adminBusinessUnits: BusinessUnit[],
    public readonly isSuperAdmin: boolean,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
