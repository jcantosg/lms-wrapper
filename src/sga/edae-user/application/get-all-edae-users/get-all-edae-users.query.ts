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
    public surname1?: string | null | undefined,
    public surname2?: string | null | undefined,
    public email?: string | null | undefined,
    public role?: string | null | undefined,
    public location?: string | null | undefined,
    public businessUnit?: string | null | undefined,
  ) {}
}
