import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';

export class GetAllExaminationCentersQuery
  extends CollectionQuery
  implements Query
{
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    public readonly name?: string,
    public readonly code?: string,
    public readonly isActive?: boolean,
    public readonly address?: string,
    public readonly country?: string,
    public readonly businessUnits?: string[],
    public readonly classrooms?: string[],
  ) {
    super(page, limit, orderBy, orderType);
  }
}
