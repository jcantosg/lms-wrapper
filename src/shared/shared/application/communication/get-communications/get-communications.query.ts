import { Query } from '#shared/domain/bus/query';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class GetCommunicationsQuery implements Query {
  constructor(
    public readonly adminUser: AdminUser,
    public readonly subject: string | null,
    public readonly sentBy: string | null,
    public readonly businessUnit: string | null,
    public readonly createdAt: Date | null,
    public readonly sentAt: Date | null,
    public readonly status: CommunicationStatus | null,
    public readonly orderBy: string,
    public readonly orderType: OrderTypes,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
