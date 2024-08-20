import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetSubjectCallScheduleHistoryQuery implements Query {
  constructor(
    public readonly orderBy: string,
    public readonly orderType: OrderTypes,
    public readonly year: number,
    public readonly adminUser: AdminUser,
  ) {}
}
