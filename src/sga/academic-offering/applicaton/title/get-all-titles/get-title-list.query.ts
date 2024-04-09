import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Query } from '#shared/domain/bus/query';

export class GetAllTitlesListQuery extends CollectionQuery implements Query {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    readonly isSuperAdmin: boolean,
    public readonly adminBusinessUnits: BusinessUnit[],
    public readonly name?: string,
    public readonly officialCode?: string,
    public readonly officialTitle?: string,
    public readonly officialProgram?: string,
    public readonly businessUnit?: string,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
