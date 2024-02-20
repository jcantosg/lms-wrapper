import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class SearchExaminationCentersQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    public readonly text: string,
    readonly adminUserBusinessUnits: BusinessUnit[],
  ) {
    super(page, limit, orderBy, orderType);
  }
}
