import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class SearchAcademicProgramsQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
    public readonly text: string,
    public readonly adminUserBusinessUnits: BusinessUnit[],
    public readonly isSuperAdmin: boolean,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
