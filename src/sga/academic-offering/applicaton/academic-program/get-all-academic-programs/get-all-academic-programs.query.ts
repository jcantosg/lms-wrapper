import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class GetAllAcademicProgramsQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
    public readonly name: string | null,
    public readonly title: string | null,
    public readonly code: string | null,
    public readonly businessUnit: string | null,
    public readonly adminUserBusinessUnits: BusinessUnit[],
    public readonly isSuperAdmin: boolean,
    public readonly structureType: string | null,
    public readonly programBlocksNumber: number | null,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
