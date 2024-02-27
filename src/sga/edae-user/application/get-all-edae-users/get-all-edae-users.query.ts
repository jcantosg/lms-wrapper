import { OrderTypes } from '#/sga/shared/domain/criteria/order';

export class GetAllEdaeUsersQuery {
  constructor(
    readonly page: number,
    readonly limit: number,
    readonly orderBy: string,
    readonly orderType: OrderTypes,
    public adminUserBusinessUnits: string[],
    public readonly isSuperAdmin: boolean,
    public name?: string | null | undefined,
    public surname?: string | null | undefined,
    public surname2?: string | null | undefined,
    public email?: string | null | undefined,
    public roles?: string[] | null | undefined,
    public businessUnit?: string | null | undefined,
  ) {}
}
