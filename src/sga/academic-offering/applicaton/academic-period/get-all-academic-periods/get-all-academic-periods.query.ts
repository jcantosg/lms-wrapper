import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetAllAcademicPeriodsQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    readonly adminUserBusinessUnits: BusinessUnit[],
    readonly isSuperAdmin: boolean,
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    public readonly name?: string,
    public readonly code?: string,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly businesUnit?: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
