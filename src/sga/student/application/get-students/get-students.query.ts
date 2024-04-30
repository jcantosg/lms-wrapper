import { Query } from '#shared/domain/bus/query';
import { CollectionQuery } from '#/sga/shared/application/collection.query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetStudentsQuery extends CollectionQuery implements Query {
  constructor(
    public readonly name: string | null,
    public readonly surname: string | null,
    public readonly identityDocumentNumber: string | null,
    public readonly businessUnit: string | null,
    public readonly academicProgram: string | null,
    public readonly adminUser: AdminUser,
    page: number,
    limit: number,
    orderBy: string,
    orderType: OrderTypes,
  ) {
    super(page, limit, orderBy, orderType);
  }
}
